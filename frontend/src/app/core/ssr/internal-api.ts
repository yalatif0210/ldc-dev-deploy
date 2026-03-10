import { inject, Injectable } from '@angular/core';
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { InMemoryDbService, RequestInfo, STATUS } from 'angular-in-memory-web-api';
import { from, Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { find, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { base64, currentTimestamp, filterObject, TokenService, User } from '@core/authentication';

@Injectable({
  providedIn: 'root',
})
export class AppDataService implements InMemoryDbService {
  private datas: User[] = [];

  createDb(
    reqInfo?: RequestInfo
  ):
    | Record<string, unknown>
    | Observable<Record<string, unknown>>
    | Promise<Record<string, unknown>> {
    return { users: this.datas };
  }

  parseToken = (accessToken: string) => {
    const [, payload] = accessToken.split('.');

    return JSON.parse(base64.decode(payload));
  };

  getUser = (req: HttpRequest<any>) => {
    let token = '';

    if (req.body?.refresh_token) {
      token = req.body.refresh_token;
    } else if (req.headers.has('Authorization')) {
      const authorization = req.headers.get('Authorization');
      const result = (authorization as string).split(' ');
      token = result[1];
    }

    try {
      const now = new Date();
      const data = this.parseToken(token);
      let user = JSON.parse(data.sub!);
      user = filterObject({
        account_id: user.account_id || user.id,
        username: user.username,
        email: '',
        name: user.name,
        avatar: 'images/avatar.jpg',
        roles: [user.role],
      });

      return this.isExpired(data, now) ? null : user;
    } catch (e) {
      return null;
    }
  };

  isExpired = (data: any, now: Date) => {
    const expiresIn = new Date();
    expiresIn.setTime(data.exp * 1000);
    const diff = this.dateToSeconds(expiresIn) - this.dateToSeconds(now);

    return diff <= 0;
  };

  dateToSeconds = (date: Date) => {
    return Math.ceil(date.getTime() / 1000);
  };

  is(reqInfo: RequestInfo, path: string) {
    if (environment.baseUrl) {
      return false;
    }

    return new RegExp(`${path}(/)?$`, 'i').test(reqInfo.req.url);
  }

  get(reqInfo: RequestInfo) {
    const { headers, url } = reqInfo;

    if (this.is(reqInfo, 'user/menu')) {
      return ajax('data/menu.json?_t=' + Date.now()).pipe(
        map((response: any) => {
          return { headers, url, status: STATUS.OK, body: { menu: response.response.menu } };
        }),
        switchMap(response => reqInfo.utils.createResponse$(() => response))
      );
    }

    if (this.is(reqInfo, 'user')) {
      const user = this.getUser(reqInfo.req as HttpRequest<any>);
      const result = user
        ? { status: STATUS.OK, body: user }
        : { status: STATUS.UNAUTHORIZED, body: {} };
      const response = Object.assign({ headers, url }, result);

      return reqInfo.utils.createResponse$(() => response);
    }

    return;
  }

  post(reqInfo: RequestInfo) {
    if (this.is(reqInfo, 'auth/refresh')) {
      return this.refresh(reqInfo);
    }

    if (this.is(reqInfo, 'auth/logout')) {
      return this.logout(reqInfo);
    }

    return;
  }

  private refresh(reqInfo: RequestInfo) {
    const { headers, url } = reqInfo;
    const user = this.getUser(reqInfo.req as HttpRequest<any>);
    const result = user
      ? { status: STATUS.OK, body: user }
      : { status: STATUS.UNAUTHORIZED, body: {} };
    const response = Object.assign({ headers, url }, result);

    return reqInfo.utils.createResponse$(() => response);
  }

  private logout(reqInfo: RequestInfo) {
    const { headers, url } = reqInfo;
    const response = { headers, url, status: STATUS.OK, body: {} };

    return reqInfo.utils.createResponse$(() => response);
  }
}

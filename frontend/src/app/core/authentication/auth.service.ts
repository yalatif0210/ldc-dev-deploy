import { Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  iif,
  map,
  merge,
  Observable,
  of,
  share,
  switchMap,
  tap,
} from 'rxjs';
import { filterObject, isEmptyObject } from './helpers';
import { Token, User } from './interface';
import { LoginService } from './login.service';
import { TokenService } from './token.service';
import { LocalStorageService } from '@shared';
import UserModel from '@shared/models/user.model';
import { UserRole } from '@core/bootstrap';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly key = 'ldc-settings';
  private readonly tokenKey = 'ldc-token';
  private readonly loginService = inject(LoginService);
  private readonly tokenService = inject(TokenService);
  private readonly store = inject(LocalStorageService);

  private user$ = new BehaviorSubject<User>({});
  private change$ = merge(
    this.tokenService.change(),
    this.tokenService.refresh().pipe(switchMap(() => this.refresh()))
  ).pipe(
    switchMap(() => this.assignUser()),
    share()
  );

  init() {
    return new Promise<void>(resolve => this.change$.subscribe(() => resolve()));
  }

  change() {
    return this.change$;
  }

  check() {
    return this.tokenService.valid();
  }

  userRole() {
    return this.user$.pipe(map(user => user.roles?.[0]));
  }

  get userAccountId() {
    const token = this.store.get(this.tokenKey);
    const sub = this.tokenService.decodeJwt(token.access_token)?.sub;
    return sub && JSON.parse(sub!)?.account_id;
  }

  get userRoleByToken() {
    const token = this.store.get(this.tokenKey);
    const sub = this.tokenService.decodeJwt(token.access_token)?.sub;
    return sub && JSON.parse(sub!)?.role;
  }

  resetSettings() {
    this.store.remove(this.key);
  }

  isUserAdminOrSupervisor(role: any) {
    return (
      [1, 2, 3].includes(role) ||
      [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUPERVISOR].includes(role)
    );
  }

  isAdminUser(role: any) {
    return [1, 2].includes(role);
  }

  getNewUser(s1: any, s2: any) {
    console.log(s1, s2);
    const username = ['SUPERVISOR', 'ADMIN', 'SUPER_ADMIN'].includes(s1.role)
      ? `${s1.role}_${s2.name.replace(' ', '_')}`
      : `${s2.name.split(' ')[1][0]}${s2.name.split(' ')[0]}`;

    return new UserModel({
      name: s2.name,
      username,
      phone: s2.phone,
      password: s2.phone,
      role: Number(s1.role),
      platforms: (!this.isUserAdminOrSupervisor(Number(s1.role)) && [Number(s1.platform[0])]) || [],
      regions: (!this.isAdminUser(Number(s1.role)) && [Number(s1.region[0])]) || [],
    });
  }

  register(user: UserModel) {
    return this.loginService.register(user).pipe(
      tap(response => {
        return { username: response?.username, phone: response?.phone };
      })
    );
  }

  login(username: string, password: string, rememberMe = false) {
    return this.loginService.login(username, password, rememberMe).pipe(
      tap(token => this.tokenService.set(this.hydrateReceivedToken(token) as Token)),
      map(() => this.check())
    );
  }

  refresh() {
    return this.loginService
      .refresh(filterObject({ refresh_token: this.tokenService.getRefreshToken() }))
      .pipe(
        catchError(() => of(undefined)),
        tap(token => this.tokenService.set(token)),
        map(() => this.check())
      );
  }

  logout() {
    this.resetSettings();
    return this.loginService.logout().pipe(
      tap(() => this.tokenService.clear()),
      map(() => !this.check())
    );
  }

  user() {
    return this.user$.pipe(share());
  }

  menu() {
    return iif(() => this.check(), this.loginService.menu(), of([]));
  }

  private assignUser() {
    if (!this.check()) {
      return of({}).pipe(tap(user => this.user$.next(user)));
    }

    if (!isEmptyObject(this.user$.getValue())) {
      return of(this.user$.getValue());
    }

    return this.loginService.user().pipe(tap(user => this.user$.next(user)));
  }

  private hydrateReceivedToken(token: { access_token: string; refresh_token?: string }) {
    return filterObject({
      access_token: token.refresh_token,
      token_type: 'bearer',
      expires_in: this.tokenService.decodeJwt(token.refresh_token)?.exp,
      refresh_token: token.refresh_token,
    });
  }
}

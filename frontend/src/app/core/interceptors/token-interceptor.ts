import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '@core/authentication';
import { catchError, throwError } from 'rxjs';
import { BASE_URL, hasHttpScheme } from './base-url-interceptor';
import { API_GRAPHQL_END_POINT } from '@core/api-token';

export function tokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const baseUrl = inject(BASE_URL, { optional: true });
  const graphqlUrl = inject<string | null>(API_GRAPHQL_END_POINT, { optional: true });
  const tokenService = inject(TokenService);

  const includeBaseUrl = (url: string) => {
    if (!baseUrl) {
      return false;
    }
    return new RegExp(`^${baseUrl.replace(/\/$/, '')}`, 'i').test(url);
  };

  const shouldAppendToken = (url: string) =>
    !hasHttpScheme(url) || includeBaseUrl(url) || url.includes(graphqlUrl!);

  if (tokenService.valid() && shouldAppendToken(req.url)) {
    return next(
      req.clone({
        headers: req.headers.append('Authorization', tokenService.getBearerToken()),
        withCredentials: true,
      })
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          tokenService.clear();
        }
        return throwError(() => error);
      }),
    );
  }

  return next(req);
}

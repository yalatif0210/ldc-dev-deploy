import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '@core/authentication';
import { catchError, tap, throwError } from 'rxjs';
import { BASE_URL, hasHttpScheme } from './base-url-interceptor';
import { API_BASE_URL, API_GRAPHQL_END_POINT } from '@core/api-token';

export function tokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const router = inject(Router);
  const baseUrl = inject(BASE_URL, { optional: true });
  const graphqlUrl = inject<string | null>(API_GRAPHQL_END_POINT, { optional: true });
  const tokenService = inject(TokenService);

  const includeBaseUrl = (url: string) => {
    if (!baseUrl) {
      return false;
    }
    return new RegExp(`^${baseUrl.replace(/\/$/, '')}`, 'i').test(url);
  };

  const includeApiOrGraphqlBaseUrl = (url: string) => {
    return (includeBaseUrl(url) || url.includes(graphqlUrl!)) && !url.includes('/api/auth/login');
  };

  //const shouldAppendToken = (url: string) => includeApiOrGraphqlBaseUrl(url);
  const shouldAppendToken = (url: string) =>
    !hasHttpScheme(url) || includeBaseUrl(url) || url.includes(graphqlUrl!);

  const handler = () => {
    if (req.url.includes('/auth/logout')) {
      router.navigateByUrl('/auth/login');
    }

    if (router.url.includes('/auth/login') && !router.url.includes('/api/auth/login')) {
      router.navigateByUrl('/dashboard');
    }
  };

  console.log('Request URL in:', req.url);
  console.log('Should append token:', shouldAppendToken(req.url));
  console.log('Token valid:', tokenService.valid());

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
      tap(() => handler())
    );
  }

  return next(req).pipe(tap(() => handler()));
}

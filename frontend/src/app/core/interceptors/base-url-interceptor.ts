import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { InjectionToken, inject } from '@angular/core';
import { API_BASE_URL, API_GRAPHQL_END_POINT, API_REST_END_POINT } from '@core/api-token';

export const BASE_URL = new InjectionToken<string>('BASE_URL');

export function hasHttpScheme(url: string) {
  return new RegExp('^http(s)?://', 'i').test(url);
}

export function baseUrlInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const baseUrl = inject(BASE_URL, { optional: true });
  const apiRestEndPoint = inject(API_REST_END_POINT, { optional: true });
  const graphqlEndPoint = inject<string | null>(API_GRAPHQL_END_POINT, { optional: true });

  const hasSchemeOrIsApiUri = (url: string) =>
    (baseUrl && hasHttpScheme(url)) ||
    (apiRestEndPoint && url.includes(apiRestEndPoint)) ||
    (graphqlEndPoint && url.includes(graphqlEndPoint));

  const prependBaseUrl = (url: string) =>
    [baseUrl?.replace(/\/$/g, ''), url.replace(/^\.?\//, '')].filter(val => val).join('/');

  return hasSchemeOrIsApiUri(req.url) === false
    ? next(req.clone({ url: prependBaseUrl(req.url) }))
    : next(req);
}

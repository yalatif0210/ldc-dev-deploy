import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import {
  API_BASE_PORT,
  API_BASE_URL,
  API_GRAPHQL_END_POINT,
  API_REST_END_POINT,
} from '@core/api-token';

export function apiInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const graphqlEnPoint = inject<string | null>(API_GRAPHQL_END_POINT, { optional: true });
  const apiRestEndPoint = inject<string | null>(API_REST_END_POINT, { optional: true });
  const hostApi = inject<string | null>(API_BASE_URL, { optional: true });
  const portApi = inject<string | null>(API_BASE_PORT, { optional: true });
  const baseURLApi = [hostApi, portApi].filter(val => val).join(':');

  const prependBaseUrl = (url: string) => [baseURLApi, url].filter(val => val).join('');

  if (req.url.includes(apiRestEndPoint!) || req.url.includes(graphqlEnPoint!)) {
    return next(req.clone({ url: prependBaseUrl(req.url) }));
  }
  return next(req);
}

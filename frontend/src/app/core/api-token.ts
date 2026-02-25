import { InjectionToken } from '@angular/core';

export const API_BASE_URL = new InjectionToken<string>('api-base-token');
export const API_BASE_PORT = new InjectionToken<string>('api-base-port');
export const API_GRAPHQL_END_POINT = new InjectionToken<string>('api-graphql-end-point');
export const API_REST_END_POINT = new InjectionToken<string>('api-rest-end-point');

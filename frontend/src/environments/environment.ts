// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

declare global {
  interface Window {
    __env: any;
  }
}

export const environment = {
  production: false,
  baseUrl: window.__env?.BASE_URL,
  apiBaseUrl: window.__env?.API_BASE8URL,
  apiBasePort: window.__env?.API_BASE_PORT,
  graphqlEndPoint: window.__env?.GRAPHQL_END_POINT,
  apiRestEndPoint: window.__env?.API_REST_END_POINT,
  useHash: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

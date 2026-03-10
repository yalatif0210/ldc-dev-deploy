declare global {
  interface Window {
    __env: any;
  }
}

export const environment = {
  production: true,
  baseUrl: window.__env?.BASE_URL,
  apiBaseUrl: window.__env?.API_BASE8URL,
  apiBasePort: window.__env?.API_BASE_PORT,
  graphqlEndPoint: window.__env?.GRAPHQL_END_POINT,
  apiRestEndPoint: window.__env?.API_REST_END_POINT,
  useHash: false,
};

#!/bin/sh

cat <<EOF > /usr/share/nginx/html/assets/env.js
window.__env = {
  BASE_URL: "${BASE_URL}",
  API_BASE_URL: "${API_BASE_URL}",
  API_BASE_PORT: "${API_BASE_PORT}",
  GRAPHQL_END_POINT: "${GRAPHQL_END_POINT}",
  API_REST_END_POINT: "${API_REST_END_POINT}"
};
EOF

exec "$@"

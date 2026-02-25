# === Build stage ===
FROM node:20-alpine AS build
WORKDIR /app
# Installer dépendances (cache npm)
COPY package*.json ./
RUN npm ci --no-audit --no-fund --legacy-peer-deps
# Copier le code et builder
COPY . .
# Remplace "production" par l'env Angular cible si différent
RUN npm run build -- --configuration production

# === Runtime stage (Nginx) ===
FROM nginx:1.25-alpine
# Supprimer la conf par défaut si besoin
RUN rm /etc/nginx/conf.d/default.conf
# Copier une conf Nginx optimisée pour SPA Angular
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copier le build Angular
COPY --from=build /app/dist/lhspla-ldc/* /usr/share/nginx/html/
#Copier les variables environnement angular
COPY env.sh /env.sh
RUN chmod +x /env.sh
# Pour debug
EXPOSE 80
ENTRYPOINT ["/env.sh"]
CMD ["nginx", "-g", "daemon off;"]
HEALTHCHECK CMD wget -qO- http://localhost/ || exit 1


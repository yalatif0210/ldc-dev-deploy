# === Build stage ===
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
# Télécharger les dépendances (cache Maven)
RUN mvn -B -q -e -DskipTests dependency:go-offline
# Copier le code et packager
COPY src ./src
RUN mvn -B -DskipTests package

# === Runtime (JRE only) ===
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app


# Créer le répertoire des logs et donner les droits
RUN mkdir -p /app/logs && \
    chmod -R 777 /app/logs

# Créer un user non-root (bonnes pratiques)
RUN addgroup -S app && adduser -S app -G app
USER app
# Copier le jar
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
# Healthcheck simple
HEALTHCHECK CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java","-jar","/app/app.jar"]

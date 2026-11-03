# ==============================================================================
# JanSahay Backend Production Dockerfile (Spring Boot 3 + Java 17)
# Root-level Dockerfile for automatic detection on Render, Railway, Fly.io
# ==============================================================================

# Stage 1: Build stage with Maven and OpenJDK 17
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /build

# Cache Maven dependencies
COPY server/pom.xml .
RUN mvn dependency:go-offline -B

# Copy server source and package the executable fat jar
COPY server/src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Minimal, secure JRE 17 runtime
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Run as non-root user for container security
RUN groupadd -r jansahay && useradd -r -g jansahay -m jansahay

# Copy compiled jar from builder stage
COPY --from=builder /build/target/jansahay-backend-1.0.0.jar app.jar
RUN chown -R jansahay:jansahay /app

USER jansahay

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT:-8080} -Djava.security.egd=file:/dev/./urandom -jar app.jar"]

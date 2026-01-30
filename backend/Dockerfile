# Build Stage
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Run Stage
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Render sets the PORT environment variable
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Run the jar, ensuring server.port uses the Render PORT env var
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -jar app.jar"]

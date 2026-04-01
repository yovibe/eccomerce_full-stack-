# Use Eclipse Temurin JDK 21 Alpine
FROM eclipse-temurin:21-jdk-alpine

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Make Maven wrapper executable
RUN chmod +x mvnw

# Build the project, skipping tests
RUN ./mvnw clean package -DskipTests

# Expose port 8080
EXPOSE 8080

# Run the JAR
# Option 1: Use exact JAR name
CMD ["java", "-jar", "target/ecommerce-backend-0.0.1-SNAPSHOT.jar"]

# Option 2: Use shell wildcard expansion (alternative)
# CMD sh -c "java -jar target/*.jar"
# ==========================================
# Stage 1: Build (빌드 단계)
# ==========================================
# JDK를 사용하여 소스 코드를 컴파일하고 JAR 파일을 생성
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Gradle 래퍼와 설정 파일들을 먼저 복사 (캐시 효율화)
COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./
RUN chmod +x gradlew

# 의존성 다운로드
RUN ./gradlew dependencies --no-daemon

# 소스 코드 복사 및 빌드
COPY src src
RUN ./gradlew bootJar -x test --no-daemon

# ==========================================
# Stage 2: Run (실행 단계)
# ==========================================
# 실행에는 JDK가 아닌 가벼운 JRE 환경만 사용
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# 타임존 설정 (한국 시간)
ENV TZ=Asia/Seoul

# 보안을 위해 시스템 유저와 그룹 생성
RUN addgroup -S app && adduser -S app -G app

# 빌드 단계에서 생성된 JAR 파일만 복사 (소유권 변경 포함)
COPY --from=builder --chown=app:app /app/build/libs/*.jar app.jar

# 컨테이너 실행 권한을 루트가 아닌 app 유저로 변경
USER app

# 컨테이너 내에서 사용하는 포트 명시
EXPOSE 8080

# JVM 옵션 최적화: 컨테이너 메모리 할당량에 따라 유연하게 조절
# 컨테이너 환경의 메모리 인식을 위해 MaxRAMPercentage 사용
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError"

# 앱 실행
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]

FROM openjdk:11
VOLUME /tmp
EXPOSE 8080
COPY ./api/build/libs/api-0.0.1-SNAPSHOT.jar /api-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","api-0.0.1-SNAPSHOT.jar"]

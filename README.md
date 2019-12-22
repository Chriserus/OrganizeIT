# OrganizeIT

Project is supposed to help in organization of Hackathons/Game Jams. People can create projects with descriptions and organize teams in order to collaborate on making these projects. After you sign up to the application you will be able to browse, join and create projects. Administrators will be able to verify projects, that can go public and display them for other users in a public manner. There is also a Forum Board where people can search for teammates or ask questions.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need java 11 installed and some sort of MySQL Server with empty schema named: organizeit. Address and credentials to this instance can be set in [Properties of the application location](api/src/main/resources/application.properties).

### Installing

In order to deploy the entire web application to a single jar follow those steps:
1. Run command in frontend application module: [Frontend folder](organizeItClient)
```
ionic deploy --prod
```
2. Run command to wrap frontend and backend in a single jar file: [Main backend module](api)
```
gradlew build
```
3. Jar should be successfully created in output folder: api/build/libs.

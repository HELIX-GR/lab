# HELIX-GR/Lab Project

Experiment with code in your browser
Discover - Learn - Share

## Build

Copy configuration examples from `{lab,cli}/config-examples/` into `{lab,cli}/src/main/resources/config/`, then edit to adjust to your needs.

    cp config-example/* src/main/resources/config/
    # edit properties ...

Place your keystore (with key for this application as a SAML Service Provider) under `lab/src/main/resources/saml/server.jks`. This is needed
for unit tests to run, but the actual location for a production run can be configured via corresponding application properties (`helix.saml.*`).

You can generate a new keystore (if one does'nt already exist). For example:

    keytool -genkeypair -keyalg RSA -alias helix -keystore server.jks -storepass secret -keypass secret \
        -dname 'CN=lab.helix.localdomain, OU=devel, O=IMIS Athena, L=Athens, ST=Greece, C=GR'    

Build the project:

    mvn clean install

## Initialize database

After a successful build, the production/development database can be initialized and migrated to current version by simply running the command-line tool (performs a Flyway migration regardless of the subcommand invoked). For example:

    cd cli && java -jar target/helix-lab-cli-0.0.1-SNAPSHOT-exec.jar

## Run web application

Run the web application (executable) JAR:

    cd lab && java -jar target/helix-lab-0.0.1-SNAPSHOT.jar   

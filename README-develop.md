# README - Develop

## 1. Deploy thin JAR

There are plenty of methods to actually deploy the application to the target server. The following is just for speeding-up the copying of the application JAR (by separating dependencies and application) during development.

First, gather all dependencies into `target/dependency` of respective module:

    mvn --projects cli,lab dependency:copy-dependencies -DincludeScope=runtime    

Sync dependencies (expect very infrequent changes) and application JAR:
    
    TARGET_SERVER=user@web.dev.hellenicdataservice.gr ./scripts/rsync-to-target-server.sh


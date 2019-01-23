#!/bin/bash -x

if [ -z "$TARGET_SERVER" ]; then
    echo "TARGET_SERVER is not set!" && exit 1
fi

version=$(mvn help:evaluate -o -Dexpression=project.version | grep -P -i -e '^[0-9]+[.][0-9]+[.][0-9]+([-]SNAPSHOT)?$')    

# Sync cli binaries
target_path=opt/helix-lab-cli
rsync -avhi cli/target/dependency/ ${TARGET_SERVER}:${target_path}/lib/
rsync -avhi cli/target/helix-lab-cli-${version}.jar ${TARGET_SERVER}:${target_path}/helix-lab-cli-${version}.jar

# Sync lab binaries
target_path=opt/helix-lab
rsync -avhi lab/target/dependency/ ${TARGET_SERVER}:${target_path}/lib/
rsync -avhi lab/target/helix-lab-${version}.jar ${TARGET_SERVER}:${target_path}/helix-lab-${version}.jar 


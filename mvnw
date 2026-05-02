#!/bin/sh
# Maven Wrapper script
# Downloads Maven if not available, then runs it

set -e

MAVEN_VERSION="3.9.6"
MAVEN_HOME="$HOME/.m2/wrapper/dists/apache-maven-${MAVEN_VERSION}"
MAVEN_BIN="$MAVEN_HOME/bin/mvn"

if [ ! -f "$MAVEN_BIN" ]; then
    echo "Downloading Apache Maven ${MAVEN_VERSION}..."
    mkdir -p "$MAVEN_HOME"
    MAVEN_URL="https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/${MAVEN_VERSION}/apache-maven-${MAVEN_VERSION}-bin.tar.gz"
    curl -sL "$MAVEN_URL" | tar xz -C "$MAVEN_HOME" --strip-components=1
    echo "Maven ${MAVEN_VERSION} installed to ${MAVEN_HOME}"
fi

exec "$MAVEN_BIN" "$@"

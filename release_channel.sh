#!/usr/bin/env bash

GIT_REF=$(git symbolic-ref HEAD 2>/dev/null || echo "refs/heads/main")
if [[ $GIT_REF == refs/tags* ]]
then
    RELEASE_CHANNEL="stable"
else
    RELEASE_CHANNEL="edge"
fi
echo $RELEASE_CHANNEL

#!/bin/bash


# git@git.uneed.com:server/uneed-ops.git
# git@git.uneed.com:server/geeklabs.git

project=$1

cd "/home/unibot/go-proj/src/"

nowName=`ls -l | grep $project | awk '{print $9}'`

if [ ! $nowName ]
then
echo "git clone git@git.uneed.com:server/$project"
git clone git@git.uneed.com:server/$project
fi
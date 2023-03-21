#!/bin/bash
if [ $# -eq 0 ]
  then
    echo "Error: no image provided. Run ${0} <<image>>"
    exit 1
fi
DIR=$(dirname $0)
oc process -p IMAGE=$1 -f ${DIR}/class-config-map-template.yaml | oc apply -f -

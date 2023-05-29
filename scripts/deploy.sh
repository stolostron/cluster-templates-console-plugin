#!/bin/bash
if [ $# -eq 0 ]
  then
    echo "Error: no image provided. Run ${0} <<image>>"
    exit 1
fi
command="oc patch config.v1alpha1.clustertemplate.openshift.io config --type=merge -p '{\"spec\": {\"uiImage\": \"'"$1"'\", \"uiEnabled\": true}}'"
echo $command
eval $command

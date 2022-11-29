#!/bin/bash

pid=$(lsof -ti :5000)

if [ ! -z $pid ];
then
kill $pid
fi

chmod -R +x .
cd virtualenv
source bin/activate

old_path=$(echo $VIRTUAL_ENV)   
new_path=$(echo $PWD)
cd bin
sed -i "s|$old_path|$new_path|g" *
deactivate
source activate
cd ~
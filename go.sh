#!/bin/sh
 
GIT_MESSAGE="$1"
 
echo 'grunt -f && git add . && git commit -m ' + $GIT_MESSAGE + ' && git push && git push origin master && heroku open'

grunt -f 
git add .
git commit -m $GIT_MESSAGE
git push heroku master
git push origin master
heroku open
#!/bin/sh
 
# GIT_MESSAGE="$1"
 
# echo 'grunt -f && git add . && git commit -m ' + $GIT_MESSAGE + ' && git push && git push origin master && heroku open'

echo 'running grunt, git add, git commit, git push and heroku open'

grunt -f 
git add .
git commit -a
git push origin master
git push heroku master
heroku open
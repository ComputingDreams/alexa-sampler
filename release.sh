#!/bin/bash
echo "Updating main program"
cd src
/c/Program\ Files/WinZip/WZZIP.EXE -upr ../release.zip index.js
cd ..
echo "Updating libraries"
/c/Program\ Files/WinZip/WZZIP.EXE -uPr release.zip node_modules
echo "Uploading to AWS"
aws lambda update-function-code --function-name alexaSampler --zip-file fileb://release.zip

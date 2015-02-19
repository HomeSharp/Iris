# Iris
Home Sharp API (Code Name: Iris) 

## Start server
1. In console go to Iris folder
2. run "npm install"
3. run "node app"

## Tests
1. run "npm install mocha -g"
2. Set the "access"-variable to a valid access_token in Netatmo.test.js file
3. Start server as described above
4. In second console go to /Iris/app/Tests/Netatmo
5. run "mocha Devicelist.test.js"
6. run "mocha Thermostate.test.js"

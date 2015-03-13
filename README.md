# Iris
Home Sharp API (Code Name: Iris)  is the heart of HomeSharp, handling the requests and responses between the Quartz GUI and the manufacturers API:s and communication ways. Iris handles all this by using standardized names for actions, eg. "GetThermometers" works for all manufacturers products that has and uses thermometers.

## Installation
1. Install Node.js
2. Download the latest release of Iris: https://github.com/HomeSharp/Iris/releases
3. Unzip at desired location
4. Using your OS command line tool go to the Iris directory
5. Run "npm install"

## Start server
1. Using your OS command line tool go to the Iris directory
3. run "node app"

## Tests (for dev. only)
1. run "npm install mocha -g"
2. Set the "access"-variable to a valid access_token in the test files
3. Start server as described above
4. In second console go to Iris root folder
5. run "npm test"

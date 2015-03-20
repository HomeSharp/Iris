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

# Developers

## App structure

### root/
All the root contents, here you'll find the package.json containing the project dependencies, and also the app.js from where the app is initialized and run. In app.js the port from which the app is run can be changed.

### app/router.js
This is where all the routes/endpoints and what controllers they will use are defined.

### app/controllers
All controllers and their functions are defined here.

### app/Bubbles/bubbles.js
All requests from controllers go through here and get passed on to their respective bubble depending on what brand is chosen in header data

## app/Tests
This directory contains all automatic tests for the project, to run these tests follow these simple steps:

1. run "npm install mocha -g"
2. Set the "access"-variable to a valid access_token in the test files
3. Start server as described above
4. In second console go to Iris root folder
5. run "npm test"

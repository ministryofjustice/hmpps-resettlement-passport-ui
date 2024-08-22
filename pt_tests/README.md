# hmpps-resettlement-passport-ui performance tests
To run locally first install k6
`brew install k6`

To run the tests headless you will need chromium installed - to install chromium run
`brew install --force chromium --no-quarantine ` 

# Configure the tests
The tests are controlled to run by adding environment variables to execute the various scenarios. These can be configured in the run.js file. Each scenario has a specific runtime k6 executor based on the load model. 

The available runtime scenarios are:
 
 BROWSER TESTS
 * smoke
 * load
 * stress
 * soak

 API TEST
 * apiSmoke
 * api

 ** note ** 
 The API tests require an Authorization header to be added at runtime. This can be configued as an ENVIRONMENT VARIABLE depending on the environment:

* Dev = DEV_AUTH
* PreProd = PRE_PROD_AUTH

# Running the tests
To run the tests locally these can be executed from the command line in a terminal. 
Navigate to the pt_tests/tests folder
And then, to run the tests execute the following command (replacing EXECUTION_TYPE to your required runtime executor scenario):

FOR API TESTS

`k6 run -e EXECUTION_TYPE=api -e PROCESS=dev -e API_CLIENT_ID=<> -e API_CLIENT_SECRET=<> run.js`

`k6 run -e EXECUTION_TYPE=api -e PROCESS=preprod -e API_CLIENT_ID=<> -e API_CLIENT_SECRET=<> run.js`

FOR BROWSER TESTS (HEADLESS:TRUE)

`k6 run --no-setup -e EXECUTION_TYPE=smoke run.js`

FOR BROWSER TESTS (HEADLESS:FALSE)

`K6_BROWSER_HEADLESS=false k6 run --no-setup -e EXECUTION_TYPE=smoke run.js`


# The report

At the end of the test a report is generated with an array of different metrics that have been captured during the tests. 
There have been thresholds set on a selection of metrics that have been specified in the load model 
* Server response time is lower than 2000 milliseconds in 90% of requests and lower than
50000 milliseconds in 100% of requests
This is captured in `browser_http_req_duration` && `browser_http_req_failed`
* “start” page within the service should take longer than 2 seconds to load in 90% of
sessions
This is captured in `total_dashboard_time`
* The API test metrics are also monitored 
This is captured in `http_req_duration` && `http_req_failed`

Should any of these exceed the selected threshold metric an error will be displayed in the test results.



# hmpps-resettlement-passport-ui
[![repo standards badge](https://img.shields.io/badge/dynamic/json?color=blue&style=flat&logo=github&label=MoJ%20Compliant&query=%24.result&url=https%3A%2F%2Foperations-engineering-reports.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fhmpps-resettlement-passport-ui)](https://operations-engineering-reports.cloud-platform.service.justice.gov.uk/public-github-repositories.html#hmpps-resettlement-passport-ui "Link to report")
[![CircleCI](https://circleci.com/gh/ministryofjustice/hmpps-resettlement-passport-ui/tree/main.svg?style=svg)](https://circleci.com/gh/ministryofjustice/hmpps-resettlement-passport-ui)

User interface for Prepare someone for release.

## Running the app

### Dependencies
The app requires:
* resettlement-passport-api
* hmpps-auth - for authentication
* redis - session store and token caching
* AWS (or localstack) - feature flags and config in S3
* gotenberg - PDF generation

### Running the app for local development
The easiest way to run the app is to use docker compose to run all dependencies, and then use npm to run the UI.
* Create a .env file in the root of the project to set environment variables
```
API_CLIENT_ID=<add me>
API_CLIENT_SECRET=<add me>

SESSION_SECRET=00000000000000000000
HMPPS_AUTH_URL=https://sign-in-dev.hmpps.service.justice.gov.uk/auth
TOKEN_VERIFICATION_ENABLED=true
TOKEN_VERIFICATION_API_URL=https://token-verification-api-dev.prison.service.justice.gov.uk
WEB_SESSION_TIMEOUT_IN_MINUTES=60
NOMIS_USER_ROLES_API_URL=https://nomis-user-roles-api-dev.prison.service.justice.gov.uk
MANAGE_USERS_API_URL=https://manage-users-api-dev.hmpps.service.justice.gov.uk
RESETTLEMENT_PASSPORT_API_URL=http://localhost:8080
RESETTLEMENT_PASSPORT_API_LOG_REQUEST_AND_RESPONSE=false
DPS_URL=https://digital-dev.prison.service.justice.gov.uk
COMPONENT_API_URL=https://frontend-components-dev.hmpps.service.justice.gov.uk
ENVIRONMENT_NAME=LOCAL
SUPPORT_URL=https://support-dev.hmpps.service.justice.gov.uk/feedback-and-support
AWS_ACCESS_KEY_ID=foobar
AWS_SECRET_ACCESS_KEY=foobar
AWS_ENDPOINT_URL=http://localhost:4565
```
* Start up dependencies in docker: `docker compose -f docker-compose-local.yml up -d`
* Ensure [resettlement-passport-api](https://github.com/ministryofjustice/hmpps-resettlement-passport-api) is running locally on port 8080 or update env variable `RESETTLEMENT_PASSPORT_API_URL` to point to the dev site
* Install npm dependencies `npm run setup`
* Run app in dev mode: `npm run start:dev`

### Updating feature flags/config
There are feature flags and config stored in S3 for each environment which can be updated at any time. Note that due to caching it may take up to 2 minutes for changes to take effect.

## Updating flags/config locally
* Update localstack/config.json or flags.json
* Restart localstack docker container
* Changes will take effect within 2 mins

## Updating flags in dev, preprod, prod
* Update config.json or flags.json in relevant s3 bucket
* Changes will take effect within 2 mins

### Run linter

`npm run lint`

### Run tests

`npm run test`

### Running integration tests

For local running, ensure dependencies and wiremock are running:

`docker-compose -f docker-compose-local.yml -f docker-compose-test.yml up`

Then run the server in test mode by:

`npm run start-feature` (or `npm run start-feature:dev` to run with nodemon)

And then either, run tests in headless mode with:

`npm run int-test`
 
Or run tests with the cypress UI:

`npm run int-test-ui`


### Some useful commands
`npm run format` automatically lint check and format all TS files


## Change log

A changelog for the service is available [here](./CHANGELOG.md)


## Dependency Checks

The template project has implemented some scheduled checks to ensure that key dependencies are kept up to date.
If these are not desired in the cloned project, remove references to `check_outdated` job from `.circleci/config.yml`

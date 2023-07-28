## PayOff API

The API utilizing biometrics for payout and transfer authorization enhances security and user experience by verifying unique physical or behavioral traits. Users initiate transactions, provide biometric data (e.g., fingerprints), which is verified against stored templates. Successful verification authorizes the transaction, ensuring only authorized individuals can complete payouts or transfers. This biometric authentication adds a secure layer and streamlines the user experience, reducing reliance on traditional authentication methods. Compliance with privacy regulations is crucial to protect sensitive biometric information.

## Installation

```bash
$ yarn
```

## Setup Postgres and Localstack S3

```bash
$ docker compose up --force-recreate -d
$ docker compose exec localstack awslocal s3api create-bucket --bucket payoff
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

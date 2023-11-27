#!/usr/bin/env bash
set -e
export TERM=ansi
export AWS_ACCESS_KEY_ID=foobar
export AWS_SECRET_ACCESS_KEY=foobar
export AWS_DEFAULT_REGION=eu-west-2
export AWS_ENDPOINT_URL=http://localhost:4566

aws s3api create-bucket --region eu-west-2 --bucket hmpps-resettlement-passport-ui-config --create-bucket-configuration LocationConstraint=eu-west-2
aws s3api list-buckets

aws s3 cp /etc/localstack/init/ready.d/flags.json s3://hmpps-resettlement-passport-ui-config/feature-flags/flags.json
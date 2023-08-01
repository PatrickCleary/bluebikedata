#!/bin/bash -x

STACK_NAME=bluebikedataserver
BUCKET=bluebikedataserver-lambda-deployments

poetry export -f requirements.txt --output requirements.txt --without-hashes


poetry run chalice package --stage dev  --merge-template .chalice/dynamo_tables.json cfn/
aws cloudformation package --template-file cfn/sam.json --s3-bucket $BUCKET --output-template-file cfn/packaged.yaml
aws cloudformation deploy --template-file cfn/packaged.yaml --stack-name $STACK_NAME \
    --capabilities CAPABILITY_NAMED_IAM --no-fail-on-empty-changeset \


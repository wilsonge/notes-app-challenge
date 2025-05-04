# Amplify TODO Application with bedrock

This project was created for the AWS Teams 2025 challenge 

The first draft was adapted for CDK v2 from the following blog https://aws.amazon.com/blogs/mobile/deploying-a-static-website-with-aws-amplify-and-cdk/

Following this - we adapted from the following two repos:

- https://github.com/aws-samples/amplify-vite-react-template for the upto date react/vite setup
- https://github.com/aws-samples/aws-amplify-quick-notes for most the note functionality

As we just want to prioritise working on our business requirements - the bedrock integration!

## Requirements
Generate a GitHub PAT stored into AWS Secrets Manager of the target account named `george-github-token` and with the key
`github_token`. This PAT needs public repository pull access and the ability to read and write webhooks to the repo.

## Deployment
Install npm dependencies with `npm ci`. Navigate into the `amplify-infra` subdirectory of this repository and run cdk-deploy
whilst authenticated to AWS.

import * as cdk from "aws-cdk-lib";
import * as codecommit from "aws-cdk-lib/aws-codecommit";
import { Construct } from 'constructs';

export class AmplifyInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Part 1 [Optional] - Creation of the source control repository
    const amplifyReactSampleRepo = new codecommit.Repository(
        this,
        "AmplifyReactTestRepo",
        {
          repositoryName: "georgewilson-amplify-react-todo-app",
          description:
              "CodeCommit repository that will be used as the source repository for the todo react app for the AWS Team May 2025 challenge",
        }
    );
  }
}


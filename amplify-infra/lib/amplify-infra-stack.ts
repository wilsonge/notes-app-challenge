import * as cdk from 'aws-cdk-lib';
// import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import { Construct } from 'constructs';
import * as amplify from '@aws-cdk/aws-amplify-alpha';

export class AmplifyInfraStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const todoRepo = new amplify.App(
            this,
            'AmplifyTodoTestApp',
            {
                sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
                    owner: 'wilsonge',
                    repository: 'todo-app-challenge',
                    oauthToken: cdk.SecretValue.secretsManager('george-github-token', {
                        jsonField: 'github_token',
                    }),
                }),
            }
        );
        const mainBranch = todoRepo.addBranch('main');

        // TODO: Preferable - but I don't have an easy way to push to the repo right now.
        // const todoRepo = new codecommit.Repository(
        //     this,
        //     'AmplifyTodoTestApp',
        //     {
        //         repositoryName: 'georgewilson-amplify-react-todo-app',
        //         description:
        //             'CodeCommit repository that will be used as the source repository for the todo react app for the AWS Team May 2025 challenge',
        //     }
        // );
        //
        // const amplifyApp = new amplify.App(this, 'todo-react-app ', {
        //     sourceCodeProvider: new amplify.CodeCommitSourceCodeProvider({
        //         repository: todoRepo,
        //     }),
        // });
        // amplifyApp.addBranch('main');
    }
}

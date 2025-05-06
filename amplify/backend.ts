import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

const backend = defineBackend({
    auth,
    data,
});

backend.auth.resources.unauthenticatedUserIamRole.addToPrincipalPolicy(
    new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
            "polly:SynthesizeSpeech",
            "transcribe:StartStreamTranscriptionWebSocket",
        ],
        resources: ["*"],
    })
);

backend.addOutput({
    custom: {
        Predictions: {
            convert: {
                transcription: {
                    defaults: {
                        language: "en-GB",
                    },
                    proxy: false,
                    region: backend.auth.stack.region,
                },
            },
        },
    },
});

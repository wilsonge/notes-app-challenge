import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

const backend = defineBackend({
    auth,
    data,
});

backend.auth.resources.authenticatedUserIamRole.addToPrincipalPolicy(
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
                speechGenerator: {
                    defaults: {
                        voiceId: "Ivy",
                    },
                    proxy: false,
                    region: backend.auth.stack.region,
                },
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

import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
    Note: a
        .model({
            id: a.id().required(),
            title: a.string().required(),
            text: a.string().required(),
            summary: a.string().required(),
            createdAt: a.string().required(),
            updatedAt: a.string().required(),
        })
        .authorization((allow) => [allow.publicApiKey()]),

    summarize: a.generation({
        aiModel: a.ai.model('Claude 3 Haiku'),
        systemPrompt: 'Provide an accurate, clear, and concise summary of the input provided with a length of between 2 and 3 sentences.'
    })
        .arguments({ text: a.string() })
        .returns(a.string())
        .authorization((allow) => allow.publicApiKey()),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    logging: true,
    schema,
    authorizationModes: {
        defaultAuthorizationMode: "apiKey",
        // API Key is used for a.allow.public() rules
        apiKeyAuthorizationMode: {
            expiresInDays: 30,
        },
    },
});

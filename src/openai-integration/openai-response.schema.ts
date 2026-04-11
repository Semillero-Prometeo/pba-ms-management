/** JSON schema passed to OpenAI `response_format.json_schema` (strict structured output). */
export const CHAT_STRUCTURED_JSON_SCHEMA = {
  name: 'management_chat_reply',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      reply: {
        type: 'string',
        description: 'Assistant answer to the user message',
      },
    },
    required: ['reply'],
  },
} as const;

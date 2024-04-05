import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, graphqlSchema } from './schemas.js';
import { ExecutionResult, GraphQLArgs, graphql } from 'graphql';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
      const args: GraphQLArgs = {
        schema: graphqlSchema,
        source: query,
        contextValue: prisma,
        variableValues: variables,
      };

      const result: ExecutionResult = await graphql(args);
      return result;
    },
  });
};

export default plugin;

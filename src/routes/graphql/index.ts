import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { ExecutionResult, GraphQLArgs, buildSchema, graphql } from 'graphql';
import { UUIDType } from './types/uuid.js';
import { MemberTypeIdEnum } from './types/memberTypeId.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  const schema = `
    scalar ${UUIDType.name}
    scalar ${MemberTypeIdEnum.name}

    type MemberType {
      id: ${MemberTypeIdEnum.name}!
      discount: Float!
      postsLimitPerMonth: Int!
    }

    type Post {
      id: ${UUIDType.name}!
      title: String!
      content: String!
    }

    type User {
      id: ${UUIDType.name}!
      name: String!
      balance: Float!
      profile: Profile
      posts: [Post]
      memberType: MemberType
    }

    type Profile {
      id: ${UUIDType.name}!
      isMale: Boolean!
      yearOfBirth: Int!
    }

    type Query {
      memberTypes: [MemberType!]!
      posts: [Post!]!
      users: [User!]!
      profiles: [Profile!]!
      memberType(id:${MemberTypeIdEnum.name}!): MemberType!
      post(id: ${UUIDType.name}!): Post
      user(id: ${UUIDType.name}!): User
      profile(id: ${UUIDType.name}!): Profile
    }
  `;

  const root = {
    memberTypes: async () => {
      return await prisma.memberType.findMany();
    },
    posts: async () => {
      return await prisma.post.findMany();
    },
    users: async () => {
      return await prisma.user.findMany();
    },
    profiles: async () => {
      return await prisma.profile.findMany();
    },
    memberType: async ({ id }: { id: string }) => {
      return await prisma.memberType.findUnique({
        where: {
          id,
        },
      });
    },
    post: async ({ id }: { id: string }) => {
      const post = await prisma.post.findUnique({
        where: {
          id,
        },
      });
      return post ? post : null;
    },
    user: async ({ id }: { id: string }) => {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          profile: true,
        },
      });
      return user ? user : null;
    },
    profile: async ({ id }: { id: string }) => {
      const profile = await prisma.profile.findUnique({
        where: {
          id,
        },
      });
      return profile ? profile : null;
    },
  };

  const graphqlSchema = buildSchema(schema);

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
        rootValue: root,
        variableValues: variables,
      };

      const result: ExecutionResult = await graphql(args);
      return result;
    },
  });
};

export default plugin;

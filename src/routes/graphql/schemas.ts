import { Type } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client';
import { GraphQLBoolean, GraphQLList, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { ProfileType } from './types/profileType.js';
import { UserType } from './types/userType.js';
import { PostType } from './types/postType.js';
import { MemberType } from './types/memberType.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

const rootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (parent, args, context: PrismaClient) => {
        return await context.memberType.findMany();
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (parent, args, context: PrismaClient) => {
        return await context.post.findMany();
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async (parent, args, context: PrismaClient) => {
        return await context.user.findMany();
      },
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (parent, args, context: PrismaClient) => {
        return await context.profile.findMany();
      },
    },
  },
});

const rootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: GraphQLBoolean,
      resolve: () => {
        return true;
      },
    },
  },
});

export const graphqlSchema = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation,
});

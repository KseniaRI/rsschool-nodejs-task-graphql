import { Type } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client';
import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
import { ProfileType } from './types/profileType.js';
import { PostType } from './types/postType.js';
import { MemberType, MemberTypeIdEnum } from './types/memberType.js';
import { UUIDType } from './types/uuid.js';
import { UserType } from './types/userType.js';

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
  fields: () => ({
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
        return await context.user.findMany({
          include: {
            posts: true,
            profile: {
              include: {
                memberType: true,
              },
            },
          },
        });
      },
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (parent, args, context: PrismaClient) => {
        return await context.profile.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: {
        id: {
          type: new GraphQLNonNull(MemberTypeIdEnum),
        },
      },
      resolve: async (parent, { id }: { id: string }, context: PrismaClient) => {
        return await context.memberType.findUnique({
          where: {
            id,
          },
        });
      },
    },
    post: {
      type: PostType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (parent, { id }: { id: string }, context: PrismaClient) => {
        const post = await context.post.findUnique({
          where: {
            id,
          },
        });
        return post ? post : null;
      },
    },
    user: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (parent, { id }: { id: string }, context: PrismaClient) => {
        const user = await context.user.findUnique({
          where: {
            id,
          },
          include: {
            posts: true,
            profile: {
              include: {
                memberType: true,
              },
            },
          },
        });
        return user ? user : null;
      },
    },
    profile: {
      type: ProfileType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (parent, { id }: { id: string }, context: PrismaClient) => {
        const profile = await context.profile.findUnique({
          where: {
            id,
          },
        });
        return profile ? profile : null;
      },
    },
  }),
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

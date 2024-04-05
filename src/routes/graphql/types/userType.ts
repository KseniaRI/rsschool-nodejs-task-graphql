import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { PostType } from './postType.js';
import { ProfileType } from './profileType.js';
import { PrismaClient } from '@prisma/client';

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    posts: {
      type: new GraphQLList(PostType),
    },
    profile: {
      type: ProfileType,
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async ({ id }: { id: string }, args, context: PrismaClient) => {
        const users = await context.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: id,
              },
            },
          },
        });
        return users;
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async ({ id }: { id: string }, args, context: PrismaClient) => {
        const users = await context.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: id,
              },
            },
          },
        });
        return users;
      },
    },
  }),
});

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  }),
});

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    balance: {
      type: GraphQLFloat,
    },
  }),
});

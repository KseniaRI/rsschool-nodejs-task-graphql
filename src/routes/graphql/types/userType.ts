import {
  GraphQLFloat,
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
      type: new GraphQLNonNull(new GraphQLList(UserType)),
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
      type: new GraphQLNonNull(new GraphQLList(UserType)),
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

import { Type } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client';
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import {
  ChangeProfileInput,
  CreateProfileInput,
  ProfileType,
} from './types/profileType.js';
import { ChangePostInput, CreatePostInput, PostType } from './types/postType.js';
import { MemberType, MemberTypeIdEnum } from './types/memberType.js';
import { UUIDType } from './types/uuid.js';
import { ChangeUserInput, CreateUserInput, UserType } from './types/userType.js';
import {
  ChangePostInputType,
  ChangeProfileInputType,
  ChangeUserInputType,
  PostInput,
  ProfileInput,
  UserInput,
} from './types/dto.js';

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
  fields: () => ({
    createPost: {
      type: PostType,
      args: {
        dto: {
          type: new GraphQLNonNull(CreatePostInput),
        },
      },
      resolve: async (parent, args: PostInput, context: PrismaClient) => {
        const newPost = await context.post.create({ data: args.dto });
        return newPost;
      },
    },
    createUser: {
      type: UserType,
      args: {
        dto: {
          type: new GraphQLNonNull(CreateUserInput),
        },
      },
      resolve: async (parent, args: UserInput, context: PrismaClient) => {
        const newUser = await context.user.create({ data: args.dto });
        return newUser;
      },
    },
    createProfile: {
      type: ProfileType,
      args: {
        dto: {
          type: new GraphQLNonNull(CreateProfileInput),
        },
      },
      resolve: async (parent, args: ProfileInput, context: PrismaClient) => {
        const newProfile = await context.profile.create({ data: args.dto });
        return newProfile ? newProfile : null;
      },
    },
    deletePost: {
      type: GraphQLString,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (parent, { id }: { id: string }, context: PrismaClient) => {
        await context.post.delete({
          where: {
            id,
          },
        });
        return 'deleted';
      },
    },
    deleteProfile: {
      type: GraphQLString,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (parent, { id }: { id: string }, context: PrismaClient) => {
        await context.profile.delete({
          where: {
            id,
          },
        });
        return 'deleted';
      },
    },
    deleteUser: {
      type: GraphQLString,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (parent, { id }: { id: string }, context: PrismaClient) => {
        await context.user.delete({
          where: {
            id,
          },
        });
        return 'deleted';
      },
    },
    changePost: {
      type: PostType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
        dto: {
          type: new GraphQLNonNull(ChangePostInput),
        },
      },
      resolve: async (
        parent,
        { id, dto }: { id: string; dto: ChangePostInputType },
        context: PrismaClient,
      ) => {
        const post = await context.post.findUnique({ where: { id } });
        return await context.post.update({
          where: { id },
          data: {
            ...post,
            ...dto,
          },
        });
      },
    },
    changeProfile: {
      type: ProfileType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
        dto: {
          type: new GraphQLNonNull(ChangeProfileInput),
        },
      },
      resolve: async (
        parent,
        { id, dto }: { id: string; dto: ChangeProfileInputType },
        context: PrismaClient,
      ) => {
        const profile = await context.profile.findUnique({ where: { id } });
        return await context.profile.update({
          where: { id },
          data: {
            ...profile,
            ...dto,
          },
        });
      },
    },
    changeUser: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
        dto: {
          type: new GraphQLNonNull(ChangeUserInput),
        },
      },
      resolve: async (
        parent,
        { id, dto }: { id: string; dto: ChangeUserInputType },
        context: PrismaClient,
      ) => {
        const user = await context.user.findUnique({ where: { id } });
        return await context.user.update({
          where: { id },
          data: {
            ...user,
            ...dto,
          },
        });
      },
    },
    subscribeTo: {
      type: UserType,
      args: {
        userId: {
          type: new GraphQLNonNull(UUIDType),
        },
        authorId: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (
        parent,
        { userId, authorId }: { userId: string; authorId: string },
        context: PrismaClient,
      ) => {
        return context.user.update({
          where: {
            id: userId,
          },
          data: {
            userSubscribedTo: {
              create: {
                authorId: authorId,
              },
            },
          },
        });
      },
    },
    unsubscribeFrom: {
      type: GraphQLString,
      args: {
        userId: {
          type: new GraphQLNonNull(UUIDType),
        },
        authorId: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (
        parent,
        { userId, authorId }: { userId: string; authorId: string },
        context: PrismaClient,
      ) => {
        await context.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId: authorId,
            },
          },
        });
        return 'unsubscribed';
      },
    },
  }),
});

export const graphqlSchema = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation,
});

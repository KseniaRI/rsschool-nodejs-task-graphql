import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { User } from '@prisma/client';

export const UserSubscribedToType = new GraphQLObjectType({
  name: 'UserSubscribedTo',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    subscribedToUser: {
      type: new GraphQLList(UserSubscribedToType),
      resolve: async (parent: User, args, context) => {
        return parent.id;
      },
    },
  }),
});

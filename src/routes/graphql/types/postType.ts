import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { UserType } from './userType.js';

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
    authorId: {
      type: new GraphQLNonNull(UUIDType),
    },
    author: {
      type: new GraphQLNonNull(UserType),
    },
  }),
});

import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { PostType } from './postType.js';
import { MemberTypeIdEnum } from './memberType.js';
import { ProfileType } from './profileType.js';

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
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
    memberType: {
      type: new GraphQLNonNull(MemberTypeIdEnum),
    },
    profile: {
      type: ProfileType,
    },
  },
});

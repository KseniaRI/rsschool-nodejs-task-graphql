import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberType, MemberTypeIdEnum } from './memberType.js';
import { UserType } from './userType.js';

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () =>({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    isMale: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    yearOfBirth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    userId: {
      type: new GraphQLNonNull(UUIDType),
    },
    memberType: {
      type: new GraphQLNonNull(MemberType),
    },
    memberTypeId: {
      type: new GraphQLNonNull(MemberTypeIdEnum),
    },
    user: {
      type: new GraphQLNonNull(UserType),
    },
  }),
});

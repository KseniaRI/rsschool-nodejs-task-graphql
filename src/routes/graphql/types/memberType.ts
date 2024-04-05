import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { ProfileType } from './profileType.js';

export const MemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  description: 'basic or business type',
  values: {
    basic: {
      value: 'basic',
    },
    business: {
      value: 'business',
    },
  },
});

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(MemberTypeIdEnum),
    },
    discount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    postsLimitPerMonth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(ProfileType)),
    },
  }),
});

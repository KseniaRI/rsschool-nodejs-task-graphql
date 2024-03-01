import { GraphQLEnumType } from 'graphql';

export const MemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  description: 'basic or business type',
  values: {
    BASIC: {
      value: 'basic',
    },
    BUSINESS: {
      value: 'business',
    },
  },
});

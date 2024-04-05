export interface UserInput {
  dto: {
    name: string;
    balance: number;
  };
}
export interface PostInput {
  dto: {
    title: string;
    content: string;
    authorId: string;
  };
}
export interface ProfileInput {
  dto: {
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: string;
    userId: string;
  };
}
export interface ChangePostInputType {
  dto: {
    title?: string;
    content?: string;
  };
}
export interface ChangeProfileInputType {
  dto: {
    isMale?: string;
    yearOfBirth?: number;
    memberTypeId?: string;
  };
}
export interface ChangeUserInputType {
  dto: {
    name?: string;
    balance?: number;
  };
}

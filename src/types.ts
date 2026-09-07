export const Gender = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
  UNKNOWN: "unknown",
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

export interface User {
  id: string;
  email: string;
  name?: string;
  fullName?: string;
  role?: string;
}

export interface AuthLoginRequest {
  email?: string;
  username?: string;
  password?: string;
}

export interface AuthLoginResponse {
  token?: string;
  accessToken?: string;
  user?: User;
}

export interface CreatePersonRequest {
  firstName: string;
  lastName: string;
  gender: Gender;
  birthDate?: string;
  birthPlace?: string;
  bio?: string;
  parentId?: string;
}

export interface FamilyTreeNode {
  name: string;
  attributes?: Record<string, string | number | boolean>;
  children?: FamilyTreeNode[];
}
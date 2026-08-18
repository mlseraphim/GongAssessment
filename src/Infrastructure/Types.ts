import type { IUser } from "./Interfaces";

export const TApiMethod = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
} as const;

export type TApiMethodType = (typeof TApiMethod)[keyof typeof TApiMethod];


export type TAppState = {
  isLoading: boolean;
  isLoggedIn: boolean;
  currentUser: IUser | null;
  userSecret?: string | null
};

export type TAppContext = TAppState & {
  setIsLoading: (value: boolean) => void;
  login: (currentUser: IUser, userSecret: string) => Promise<void>;
  logout: () => void;
};
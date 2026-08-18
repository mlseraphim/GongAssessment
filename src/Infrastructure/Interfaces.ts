import type { TApiMethodType } from "./Types";

/* ***** API ***** */
export interface IApiRequest {
    Method: TApiMethodType;
    Url: string;
    Data?: any;
    Headers?: any;
}

export interface IApiResponse {
    SuccessResponse?: any;
    ErrorResponse?: IApiResponseError;
}

export interface IApiResponseError {
    HasError: boolean;
    Message?: string;
    Data?: any;
    Status?: string;
}
/* ***** API ***** */


/* ***** USER ***** */

export interface IUser {
  id: number;
  managerId?: number;
  email: string;
  firstName: string;
  lastName: string; 
  photo?: string;
  reportingUsers?: IUser[];
};
/* ***** USER ***** */
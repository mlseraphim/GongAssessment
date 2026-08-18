import axios from 'axios';
import type { IApiRequest, IApiResponse, IUser } from '../Infrastructure/Interfaces';
import { TApiMethod } from '../Infrastructure/Types';
import { useAppContext } from '../Hooks/AppContext';

/*
Note: I did not create this file from scratch for this assessment.
However I did fully write this code myself and this is how I normally set up API calls in my React projects.
I have edited it a bit. For example I would normally have better error handling, and send errors to a error handling component to display on the UI
*/


export const useApiCaller = () => {
    const { setIsLoading } = useAppContext();


    /* ***** USER ***** */
    const userId_Get = async (currentToken: string): Promise<number> => {
        let result: number;

        //Assumption from requirement is the secret/token is only required for this call
        //move this to CallApiCall if required for other API calls

        if (currentToken && currentToken !== '') {
            const url = `${ import.meta.env.VITE_API_BASE_URL }secrets/${ currentToken }/.json`;
        
            return await GetApiCall(url).then((response: number) => {
                if (response !== null) {
                    result = response;
                }

                return result;
            });
        }
        else {
            throw new Error('You are not logged in');
        }
    };

    const user_Get = async (_userId: number): Promise<IUser | null> => {
        let result: IUser;

        //this format doesn't return any results so temporarily hard-coding a userId to test the API call
        //const url = `${ import.meta.env.VITE_API_BASE_URL }users/${ userId }/.json`;
        const url = 'https://gongfetest.firebaseio.com/users/1/.json';
    
        return await GetApiCall(url).then((response: IUser) => {
            if (response !== null) {
                result = response;
            }

            return result;
        });
    };

    const users_Get = async (): Promise<Array<IUser>> => {
        let result: Array<IUser> = [];

        const url = `${ import.meta.env.VITE_API_BASE_URL }users/.json`;
        
        return await GetApiCall(url).then((response: Array<IUser>) => {
            if (response !== null) {
                result = response;
            }

            return result;
        });
    };
    /* ***** USER ***** */


    /* ***** PRIVATE METHODS ***** */
    const GetApiCall = async (url: string) => {
        const params: IApiRequest = {
            Method: TApiMethod.GET,
            Url: url
        };

        return CallApiCall(params);
    };

    /*
    Note: leaving these here for reference for how I normally set up different tyles of API calls

    const PostApiCall = async (url: string, data: any) => {
        const params: IApiRequest = {
            Method: TApiMethod.POST,
            Url: url,
            Data: data
        };

        return CallApiCall(params);
    };

    const DeleteApiCall = async (url: string, data?: any) => {
        const params: IApiRequest = {
            Method: TApiMethod.DELETE,
            Url: url,
            Data: data
        };

        return CallApiCall(params);
    };
    */

    const CallApiCall = async (params: IApiRequest) => {
        setIsLoading(true);

        const result: Promise<IApiResponse> = await ApiCall(params);

        setIsLoading(false);

        if ((await result).SuccessResponse) {
            return (await result).SuccessResponse;
        } 
        else {
            return null;
        }
    };

    const ApiCall = async(params: IApiRequest): Promise<any> => {
        let headers = {
            ...params.Headers,
            //'Authorization': `Bearer ${ currentToken }`,
            'Content-Type': 'application/json'
        };

        return await axios({
            method: params.Method,
            url: params.Url,
                data: params.Data,
            headers: headers
        })
        .then(response => {
            const result: IApiResponse = {
                SuccessResponse: response.data
            };

            return result;
        })
        .catch(error => {
            throw new Error(error);
        });        
    };
    /* ***** PRIVATE METHODS ***** */


    return {
        UserIdGet: userId_Get,
        UserGet: user_Get,
        UsersGet: users_Get
    };
};

export default useApiCaller;
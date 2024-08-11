export interface IApiResponse {
    statusCode: number;
    message: string;
    data?: any;
    isSuccess: boolean;
}
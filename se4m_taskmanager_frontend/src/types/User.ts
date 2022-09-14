export interface ICreateUserDTO {
    username?: string;
    name?: string;
    password?: string;
}

export interface ILoginUserDTO {
    username?: string;
    password?: string;
}

export interface ITokens {
    accessToken: string;
    refreshToken: string;
}

export interface ILoginResponse {
    access_token: string;
    refresh_token: string;
}

export interface IUser {
    username: string;
    name: string;
    isUserLoggedIn: boolean;
}

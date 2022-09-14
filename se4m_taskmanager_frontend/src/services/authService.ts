import { AxiosResponse } from "axios";
import Messages from "constants/Messages";
import {
    userStoreAccessManager,
    UserStoreAccessManager,
} from "redux/userStore/UserStoreAccessManager";
import { ICreateUserDTO, ILoginResponse, ILoginUserDTO } from "types";
import BackendUrlResolver from "../constants/BackendUrlResolver";
import HttpService from "./httpService";

class AuthService {
    constructor(
        private httpService: HttpService,
        private storeManager: UserStoreAccessManager
    ) {}

    public async signUpUser(userdata: ICreateUserDTO) {
        const url = BackendUrlResolver.getRegisterUrl();
        try {
            const result = await this.httpService
                .getUnauthorizedAxios()
                .post(url, userdata);

            if (result.status !== 202) {
                throw new Error();
            }
            return this.signInUser({
                username: userdata.username,
                password: userdata.password,
            });
        } catch (error) {
            throw new Error(
                Messages.UserService.ExceptionMessages.REGISTER_FAILED
            );
        }
    }

    public initializeSession() {
        const accessToken = localStorage.getItem("access_token");
        const refreshToken = localStorage.getItem("refresh_token");

        if (!accessToken || !refreshToken) return;

        this.storeManager.signInUser({
            accessToken,
            refreshToken,
        });
    }

    public async signInUser(loginData: ILoginUserDTO) {
        const { username, password } = loginData;
        if (!username || !password) {
            throw new Error("s");
        }

        const url = BackendUrlResolver.getLoginUrl();
        const params = new URLSearchParams();
        params.append("username", username);
        params.append("password", password);

        try {
            const response: AxiosResponse<ILoginResponse> = await this.httpService.getUnauthorizedAxios().post(url, params);

            if (response.status !== 200) {
                throw new Error("");
            }
            const accessToken = response.data.access_token;
            const refreshToken = response.data.refresh_token;
            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", refreshToken);
            this.storeManager.signInUser({ accessToken, refreshToken });
            return Messages.UserService.SuccessMessages.USER_LOGGED_IN;
        } catch (error: any) {
            if (error.response && error.response.data.message) {
                throw new Error(error.response.data.message);
            } else {
                throw new Error(
                    Messages.UserService.ExceptionMessages.LOGIN_FAILED
                );
            }
        }
    }

    public signOutUser() {
        this.storeManager.signOutUser();
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    }
}

const AUTHSERVICE_INSTANCE = new AuthService(
    new HttpService(),
    userStoreAccessManager
);
export { AuthService, AUTHSERVICE_INSTANCE };

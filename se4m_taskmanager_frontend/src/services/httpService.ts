import axios, { AxiosError, AxiosInstance } from "axios";
import {
    UserStoreAccessManager,
    userStoreAccessManager,
} from "redux/userStore/UserStoreAccessManager";

/**
 * Custom HTTP Service for getting pre-configured HTTP Client
 */
class HttpService {
    private unAuthorizedAxios: AxiosInstance | null = null;

    private authorizedAxios: AxiosInstance | null = null;

    private userStoreManager: UserStoreAccessManager = userStoreAccessManager;

    /**
     * returns pre-configured HTTP Client without authentication
     */
    getUnauthorizedAxios() {
        if (!this.unAuthorizedAxios) {
            this.unAuthorizedAxios = axios.create({});
        }
        return this.unAuthorizedAxios;
    }

    /**
     * returns pre-configured HTTP Client with authentication
     */
    getAxios() {
        const tokens = this.userStoreManager.getTokens();
        const newAxiosInstance = axios.create({
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=utf-8",
                Authorization: `Bearer ${tokens ? tokens.accessToken : ""}`,
            },
            timeout: 6000,
        });

        newAxiosInstance.interceptors.response.use(
            (response) => {
                return response;
            },
            (err: AxiosError) => {
                const status = err.response?.status;
                if ((status && status === 403) || status === 401) {
                    this.userStoreManager.signOutUser();
                }
            }
        );

        this.authorizedAxios = newAxiosInstance;

        return this.authorizedAxios;
    }
}

export default HttpService;

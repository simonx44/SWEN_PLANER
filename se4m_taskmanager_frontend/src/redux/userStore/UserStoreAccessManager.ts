import { ITokens, IUser } from "types";
import { store } from "../store";
import { mapDispatch, UserState } from "./user";

class UserStoreAccessManager {
    private userStore: any;

    constructor(listStore: any) {
        this.userStore = listStore;
    }

    public getState(): UserState {
        return this.userStore.getState().user;
    }

    public isUserLoggedIn(): boolean {
        return this.getState().user.isUserLoggedIn;
    }

    public getUserData(): IUser {
        return this.getState().user;
    }

    public getTokens(): ITokens | undefined {
        return this.getState().tokens;
    }

    public signInUser(data: ITokens) {
        this.userStore.dispatch(mapDispatch.loginUser(data));
    }

    public signOutUser() {
        this.userStore.dispatch(mapDispatch.logoutUser());
    }

    public setUserData(data: IUser) {
        this.userStore.dispatch(mapDispatch.setUserData(data));
    }
}

const userStoreAccessManager = new UserStoreAccessManager(store);
export { userStoreAccessManager, UserStoreAccessManager };

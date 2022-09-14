import { createSlice } from "@reduxjs/toolkit";
import { connect, ConnectedProps } from "react-redux";
import { ITokens, IUser } from "types";
import { RootState } from "../store";

export interface UserState {
    tokens?: ITokens;
    user: IUser;
}

const initialState: UserState = {
    tokens: { accessToken: "", refreshToken: "" },
    user: { name: "", username: "", isUserLoggedIn: false },
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginUser: (state, action) => {
            const { refreshToken, accessToken } = action.payload as ITokens;
            state.user.isUserLoggedIn = true;
            state.tokens = { refreshToken, accessToken };
        },
        logoutUser: (state) => {
            state.user.isUserLoggedIn = false;
            state.tokens = undefined;
        },
        setUserData: (state, action) => {
            state.user = {
                ...state.user,
                name: action.payload.name,
                username: action.payload.username,
            };
        },
    },
});

const mapState = (state: RootState) => ({
    tokens: state.user.tokens,
    user: state.user.user,
});

export const { loginUser, setUserData, logoutUser } = userSlice.actions;
export const mapDispatch = {
    loginUser,
    logoutUser,
    setUserData,
};

export const connector = connect(mapState, mapDispatch);

export type UserStoreProps = ConnectedProps<typeof connector>;

export default userSlice.reducer;

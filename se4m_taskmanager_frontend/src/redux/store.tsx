import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counter";
import listReducer from "./listStore/lists";
import userReducer from "./userStore/user";

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        list: listReducer,
        user: userReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

import { createSlice } from "@reduxjs/toolkit";
import { connect, ConnectedProps } from "react-redux";
import { TaskList } from "../../types/TaskList";
import { RootState } from "../store";

export interface ListsState {
    lists: Array<TaskList>;
    isLoading: boolean;
}

const initialState: ListsState = {
    lists: [],
    isLoading: false,
};

export const listSlice = createSlice({
    name: "lists",
    initialState,
    reducers: {
        toggleLoading: (state) => {
            state.isLoading = !state.isLoading;
        },
        updateLists: (state, action) => {
            state.lists = action.payload;
        },
        addList: (state, action) => {
            const list = action.payload;
            state.lists = [...state.lists, list];
        },
        removeList: (state, action) => {
            const listId = action.payload;

            state.lists = state.lists.filter((li) => li.listId !== listId);
        },
        modifyList: (state, action) => {
            const { listId, modifiedList } = action.payload;

            const indexToUpdate = state.lists.findIndex(
                (li) => li.listId === listId
            );

            if (indexToUpdate >= 0) {
                const updatedLists = [...state.lists];
                updatedLists[indexToUpdate] = modifiedList;
                state.lists = updatedLists;
            }
        },
    },
});

const mapState = (state: RootState) => ({
    lists: state.list.lists,
    isLoading: state.list.isLoading,
});

export const mapDispatch = {
    toggleLoading: listSlice.actions.toggleLoading,
    updateLists: listSlice.actions.updateLists,
    addList: listSlice.actions.addList,
    removeList: listSlice.actions.removeList,
    modifyList: listSlice.actions.modifyList,
};

export const connector = connect(mapState, mapDispatch);

export type ListStoreProps = ConnectedProps<typeof connector>;

export const { toggleLoading, updateLists, addList } = listSlice.actions;

export default listSlice.reducer;

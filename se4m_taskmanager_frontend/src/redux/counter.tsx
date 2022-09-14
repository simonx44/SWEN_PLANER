import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "./store";

export interface CounterState {
    value: number;
}

const initialState: CounterState = {
    value: 0,
};

export const counterSlice = createSlice({
    name: "counter",
    initialState,
    reducers: {
        increment: (state) => {
            // eslint-disable-next-line no-param-reassign
            state.value += 1;
        },
        decrement: (state) => {
            // eslint-disable-next-line no-param-reassign
            state.value -= 1;
        },
        incrementByAmount: (state, action: PayloadAction<number>) => {
            // eslint-disable-next-line no-param-reassign
            state.value += action.payload;
        },
    },
});

const mapState = (state: RootState) => ({
    value: state.counter.value,
});

const mapDispatch = {
    incrementValue: counterSlice.actions.increment,
    decrementValue: counterSlice.actions.decrement,
};

export const connector = connect(mapState, mapDispatch);

export type PropsFromRedux = ConnectedProps<typeof connector>;

export const { increment, decrement } = counterSlice.actions;

export default counterSlice.reducer;

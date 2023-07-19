import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import { waveTableEditReducers } from "./slices/wavetable-edit-slice";
import { waveTableSynthReducers } from "./slices/wavetable-synth-slice";

export const store = configureStore(
    {
        reducer:
        {
            waveTableEditReducers,
            waveTableSynthReducers
        }
    }
);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
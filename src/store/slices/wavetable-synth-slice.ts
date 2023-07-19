import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Note, NoteData } from "../../audio/basic-data/note";
import { AudioService } from "../../audio/service/audio-service";

import { ILogObj, Logger } from "tslog";
import { InfoLogMsg } from "../../log/info-log-messages";
import { WarnLogMsg } from "../../log/warn-log-messages";

export interface WaveTableSynthState
{
    currentNote: NoteData
}

const initialState: WaveTableSynthState =
{
    currentNote: new Note().getData()
};

const mainLogger: Logger<ILogObj> = new Logger({ name: "waveTableSynthSlice: " });
const audioService = AudioService.getSingleton();

const waveTableSynthSlice = createSlice(
    {
        name: "waveTableSynth",
        initialState: initialState,
        reducers:
        {
            noteOn: (state, action: PayloadAction<NoteData>) =>
            {
                mainLogger.info("noteOn: " + InfoLogMsg.REDUCER_START);

                if(action.payload != null)
                {
                    mainLogger.debug(`noteSemitone: ${action.payload.semitone}`);
                    audioService.getWaveTableSynth().noteOn(action.payload);

                    return {
                        ...state,
                        currentNote: action.payload
                    };
                }
                else
                {
                    mainLogger.warn("noteOn: " + WarnLogMsg.NULL_ARG + ": payload NoteData");
                    return state;
                }
            }
        }
    }
);

export const {noteOn} = waveTableSynthSlice.actions;

export const waveTableSynthReducers = waveTableSynthSlice.reducer;
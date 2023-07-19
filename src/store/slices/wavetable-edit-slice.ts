import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AudioService } from "../../audio/service/audio-service";
import { SingleWaveform, SingleWaveformData } from "../../audio/wavetable/single-waveform";
import { WaveformShape } from "../../audio/basic-data/waveform-shape";

import { ILogObj, Logger } from "tslog";
import { InfoLogMsg } from "../../log/info-log-messages";
import { WarnLogMsg } from "../../log/warn-log-messages";

export interface WaveTableEditState
{
    mainWaveformsArray: Array<SingleWaveformData>;
    currentEditedWaveformIndex: number;
}

function initWaveformArray(): Array<SingleWaveformData>
{
    const waveformArray = new Array<SingleWaveformData>(2);
    for(let i=0; i<waveformArray.length; i++)
    {
        waveformArray[i] = new SingleWaveform(`wave ${i}`).getData();
    }

    return waveformArray;
}

const initialState: WaveTableEditState =
{
    mainWaveformsArray: initWaveformArray(),
    currentEditedWaveformIndex: 0
};

const mainLogger: Logger<ILogObj> = new Logger({ name: "waveTableEditSlice: " });
const audioService = AudioService.getSingleton();

const waveTableEditSlice = createSlice(
    {
        name: "waveTableEdit",
        initialState: initialState,
        reducers:
        {
            setCurrentEditedWaveformIndex: (state, action: PayloadAction<number>) =>
            {
                mainLogger.info("setCurrentEditedWaveform: " + InfoLogMsg.REDUCER_START + ` index: ${action.payload}`);

                if(0 <= action.payload && action.payload < state.mainWaveformsArray.length)
                    return {
                                ...state,
                                currentEditedWaveformIndex: action.payload
                            };
                else
                {
                    mainLogger.warn("setCurrentEditedWaveform: " + WarnLogMsg.ILLEGAL_ARG + "index out of bounds");
                    return state;
                }
            },

            setCurrentWaveformStartShape: (state, action: PayloadAction<WaveformShape>) =>
            {
                mainLogger.info("setCurrentWaveformShape: " + InfoLogMsg.REDUCER_START);

                if(action.payload != null)
                {
                    /* The waveform to which this modificati0on is being applied.
                        Because the real waveform is non serializable, we cannot get it from the
                        store (slice), we must get it from the service. */
                    let currentWaveform = audioService.getWaveTableSynth()
                                                    .getWaveTable()
                                                    .getMainWave(state.currentEditedWaveformIndex);

                    if(currentWaveform != null)
                    {
                        // before we modify the waveform in the store, we first modify it in the service
                        currentWaveform.setStartShape(action.payload);

                        // and then we can modify the serializable data from the store:
                        // 1. make a copy of the array from the store
                        const newWaveformArray = [...state.mainWaveformsArray];

                        // 2. modify the correct element from the array copy
                        newWaveformArray[state.currentEditedWaveformIndex] = currentWaveform.getData();

                        return {
                            ...state,
                            mainWaveformsArray: newWaveformArray
                        };
                    }
                    else
                    {
                        mainLogger.warn("setCurrentWaveformShape: " + WarnLogMsg.NULL_INTERNAL_STATE + ": currentWaveform");
                        return state;
                    }
                }
                else
                {
                    mainLogger.warn("setCurrentWaveformShape: " + WarnLogMsg.NULL_ARG + ": payload WaveformShape");
                    return state;
                }
            },

            setCurrentWaveformEndShape: (state, action: PayloadAction<WaveformShape>) =>
            {
                mainLogger.info("setCurrentWaveformEndShape: " + InfoLogMsg.REDUCER_START);

                if(action.payload != null)
                {
                    /* The waveform to which this modificati0on is being applied.
                        Because the real waveform is non serializable, we cannot get it from the
                        store (slice), we must get it from the service. */
                    let currentWaveform = audioService.getWaveTableSynth()
                                                    .getWaveTable()
                                                    .getMainWave(state.currentEditedWaveformIndex);

                    if(currentWaveform != null)
                    {
                        // before we modify the waveform in the store, we first modify it in the service
                        currentWaveform.setEndShape(action.payload);

                        // and then we can modify the serializable data from the store:
                        // 1. make a copy of the array from the store
                        const newWaveformArray = [...state.mainWaveformsArray];
                        // 2. modify the correct element from the array copy
                        newWaveformArray[state.currentEditedWaveformIndex] = currentWaveform.getData();

                        return {
                            ...state,
                            mainWaveformsArray: newWaveformArray
                        };
                    }
                    else
                    {
                        mainLogger.warn("setCurrentWaveformEndShape: " + WarnLogMsg.NULL_INTERNAL_STATE + ": currentWaveform");
                        return state;
                    }
                }
                else
                {
                    mainLogger.warn("setCurrentWaveformEndShape: " + WarnLogMsg.NULL_ARG + ": payload WaveformShape");
                    return state;
                }
            },

            setCurrentWaveformStartOctaveDetune: (state, action: PayloadAction<number>) =>
            {
                mainLogger.info(
                    "setCurrentWaveformStartOctaveDetune: " + InfoLogMsg.REDUCER_START +
                    ` octaveDetune: ${action.payload}`);

                /* The waveform to which this modificati0on is being applied.
                    Because the real waveform is non serializable, we cannot get it from the
                    store (slice), we must get it from the service. */
                let currentWaveform = audioService.getWaveTableSynth()
                                                .getWaveTable()
                                                .getMainWave(state.currentEditedWaveformIndex);

                if(currentWaveform != null)
                {
                    // before we modify the waveform in the store, we first modify it in the service
                    // currentWaveform.getStartNoteDetune().addOctaves(action.payload);
                    currentWaveform.setStartOctaveDetune(action.payload);

                    // and then we can modify the serializable data from the store:
                    // 1. make a copy of the array from the store
                    const newWaveformArray = [...state.mainWaveformsArray];

                    // 2. modify the correct element from the array copy
                    newWaveformArray[state.currentEditedWaveformIndex] = currentWaveform.getData();

                    return {
                        ...state,
                        mainWaveformsArray: newWaveformArray
                    };
                }
                else
                {
                    mainLogger.warn("setCurrentWaveformStartOctaveDetune: " + WarnLogMsg.NULL_INTERNAL_STATE + ": currentWaveform");
                    return state;
                }
            },

            setCurrentWaveformStartSemitoneDetune: (state, action: PayloadAction<number>) =>
            {
                mainLogger.info(
                    "setCurrentWaveformStartSemitoneDetune: " + InfoLogMsg.REDUCER_START +
                    ` semitoneDetune: ${action.payload}`);

                /* The waveform to which this modificati0on is being applied.
                    Because the real waveform is non serializable, we cannot get it from the
                    store (slice), we must get it from the service. */
                let currentWaveform = audioService.getWaveTableSynth()
                                                .getWaveTable()
                                                .getMainWave(state.currentEditedWaveformIndex);

                if(currentWaveform != null)
                {
                    // before we modify the waveform in the store, we first modify it in the service
                    // currentWaveform.getStartNoteDetune().addSemitones(action.payload);
                    currentWaveform.setStartSemitoneDetune(action.payload);

                    // and then we can modify the serializable data from the store:
                    // 1. make a copy of the array from the store
                    const newWaveformArray = [...state.mainWaveformsArray];

                    // 2. modify the correct element from the array copy
                    newWaveformArray[state.currentEditedWaveformIndex] = currentWaveform.getData();

                    return {
                        ...state,
                        mainWaveformsArray: newWaveformArray
                    };
                }
                else
                {
                    mainLogger.warn("setCurrentWaveformStartSemitoneDetune: " + WarnLogMsg.NULL_INTERNAL_STATE + ": currentWaveform");
                    return state;
                }
            },

            setCurrentWaveformEndOctaveDetune: (state, action: PayloadAction<number>) =>
            {
                mainLogger.info("setCurrentWaveformEndOctaveDetune: " + InfoLogMsg.REDUCER_START);

                /* The waveform to which this modificati0on is being applied.
                    Because the real waveform is non serializable, we cannot get it from the
                    store (slice), we must get it from the service. */
                let currentWaveform = audioService.getWaveTableSynth()
                                                .getWaveTable()
                                                .getMainWave(state.currentEditedWaveformIndex);

                if(currentWaveform != null)
                {
                    // before we modify the waveform in the store, we first modify it in the service
                    // currentWaveform.getEndNoteDetune().addOctaves(action.payload);
                    currentWaveform.setEndOctaveDetune(action.payload);

                    // and then we can modify the serializable data from the store:
                    // 1. make a copy of the array from the store
                    const newWaveformArray = [...state.mainWaveformsArray];

                    // 2. modify the correct element from the array copy
                    newWaveformArray[state.currentEditedWaveformIndex] = currentWaveform.getData();

                    return {
                        ...state,
                        mainWaveformsArray: newWaveformArray
                    };
                }
                else
                {
                    mainLogger.warn("setCurrentWaveformEndOctaveDetune: " + WarnLogMsg.NULL_INTERNAL_STATE + ": currentWaveform");
                    return state;
                }
            },

            setCurrentWaveformEndSemitoneDetune: (state, action: PayloadAction<number>) =>
            {
                mainLogger.info("setCurrentWaveformEndSemitoneDetune: " + InfoLogMsg.REDUCER_START);

                /* The waveform to which this modificati0on is being applied.
                    Because the real waveform is non serializable, we cannot get it from the
                    store (slice), we must get it from the service. */
                let currentWaveform = audioService.getWaveTableSynth()
                                                .getWaveTable()
                                                .getMainWave(state.currentEditedWaveformIndex);

                if(currentWaveform != null)
                {
                    // before we modify the waveform in the store, we first modify it in the service
                    currentWaveform.setEndSemitoneDetune(action.payload);

                    // and then we can modify the serializable data from the store:
                    // 1. make a copy of the array from the store
                    const newWaveformArray = [...state.mainWaveformsArray];

                    // 2. modify the correct element from the array copy
                    newWaveformArray[state.currentEditedWaveformIndex] = currentWaveform.getData();

                    return {
                        ...state,
                        mainWaveformsArray: newWaveformArray
                    };
                }
                else
                {
                    mainLogger.warn("setCurrentWaveformEndSemitoneDetune: " + WarnLogMsg.NULL_INTERNAL_STATE + ": currentWaveform");
                    return state;
                }
            },

            setCurrentWaveformAmplitudesArray: (state, action: PayloadAction<Array<number>>) =>
            {
                mainLogger.info("setCurrentWaveformAmplitudesArray: " + InfoLogMsg.REDUCER_START);

                if(action.payload != null)
                {
                    /* The waveform to which this modificati0on is being applied.
                        Because the real waveform is non serializable, we cannot get it from the
                        store (slice), we must get it from the service. */
                    let currentWaveform = audioService.getWaveTableSynth()
                                                    .getWaveTable()
                                                    .getMainWave(state.currentEditedWaveformIndex);

                    if(currentWaveform != null)
                    {
                        // before we modify the waveform in the store, we first modify it in the service
                        currentWaveform.setAmplitudesArray(action.payload);

                        // and then we can modify the serializable data from the store:
                        // 1. make a copy of the array from the store
                        const newWaveformArray = [...state.mainWaveformsArray];

                        // 2. modify the correct element from the array copy
                        newWaveformArray[state.currentEditedWaveformIndex] = currentWaveform.getData();

                        return {
                            ...state,
                            mainWaveformsArray: newWaveformArray
                        };
                    }
                    else
                    {
                        mainLogger.warn("setCurrentWaveformAmplitudesArray: " + WarnLogMsg.NULL_INTERNAL_STATE + ": currentWaveform");
                        return state;
                    }
                }
                else
                {
                    mainLogger.warn("setCurrentWaveformAmplitudesArray: " + WarnLogMsg.NULL_ARG + ": payload Array");
                    return state;
                }
            },
        }
    }
);

export const {
                setCurrentEditedWaveformIndex,

                setCurrentWaveformStartShape,
                setCurrentWaveformEndShape,

                setCurrentWaveformStartOctaveDetune,
                setCurrentWaveformStartSemitoneDetune,

                setCurrentWaveformEndOctaveDetune,
                setCurrentWaveformEndSemitoneDetune,

                setCurrentWaveformAmplitudesArray
            }
            = waveTableEditSlice.actions;

export const waveTableEditReducers = waveTableEditSlice.reducer;

import { useState } from "react";
import { useDispatch } from "react-redux";

import { DigitalDisplayFrame } from "../decorations/DigitalDisplayFrame";
import { SingleStepEditor } from "./SingleStepEditor";
import
{
    setCurrentEditedWaveformIndex,
    setCurrentWaveformAmplitudesArray
} from "../../store/slices/wavetable-edit-slice";

import { Logger, ILogObj } from "tslog";

import { AUDIO_SETTINGS } from "../../audio/service/audio-settings";

import styles from "./WaveformStepEditor.module.css";

export interface WaveformStepEditorProps
{
    children?: any;
    editedWaveformIndex: number;
}

const mainLogger: Logger<ILogObj> = new Logger({ name: "WaveformStepEditor" });

export function WaveformStepEditor(props: WaveformStepEditorProps): JSX.Element
{
    const stepArray = new Array<number>(AUDIO_SETTINGS.discreteAmplitudesStepCount).fill(0.5);
    const [amplitudeStepArray, setAmplitudeStepArray] = useState(stepArray);

    const dispatch = useDispatch();

    const changeHandler = (changedElementIndex: number, newAmplitudeValue: number) =>
    {
        mainLogger.info("changeHandler");

        if(0 <= changedElementIndex && changedElementIndex < AUDIO_SETTINGS.discreteAmplitudesStepCount &&
            0.0 <= newAmplitudeValue && newAmplitudeValue <= 1.0)
        {
            // 1. copy the old array (for 'useState()' we cannot modify current state)
            const newArray = [...amplitudeStepArray];

            // 2. apply the modification to the new array and set the internal state
            newArray[changedElementIndex] = newAmplitudeValue;
            setAmplitudeStepArray(newArray);

            // 3. propagate the modification to the parent callback:
            // in the store, modify the currently edited waveform
            dispatch( setCurrentEditedWaveformIndex(props.editedWaveformIndex) );
            // in the store, modify the discrete amplitudes of that waveform
            dispatch( setCurrentWaveformAmplitudesArray(amplitudeStepArray));
        
        }
    };

    return (
        <div className={styles.mainContainer}>
            <DigitalDisplayFrame>
                <div className={styles.stepsContainer}>
                    {
                        stepArray.map((stepAmplitude, stepIndex) =>
                            <div key={stepIndex}>
                                <SingleStepEditor index={stepIndex} onValChangeHandler={changeHandler}>
                                </SingleStepEditor>
                            </div>
                        )
                    }
                </div>
            </DigitalDisplayFrame>
        </div>
    );
}
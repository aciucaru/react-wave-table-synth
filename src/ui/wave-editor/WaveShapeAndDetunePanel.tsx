import { useDispatch } from "react-redux";
import
{
    setCurrentEditedWaveformIndex,

    setCurrentWaveformStartOctaveDetune,
    setCurrentWaveformStartSemitoneDetune,

    setCurrentWaveformEndOctaveDetune,
    setCurrentWaveformEndSemitoneDetune,
} from "../../store/slices/wavetable-edit-slice";

import { NumControl } from "../controls/NumControl";
import { WaveformSelector, WaveformSide } from "../controls/WaveformSelector";

import { AUDIO_SETTINGS } from "../../audio/service/audio-settings";

import { Logger, ILogObj } from "tslog";
import { InfoLogMsg } from "../../log/info-log-messages";
import { WarnLogMsg } from "../../log/warn-log-messages";

import styles from "./WaveShapeAndDetunePanel.module.css";

export interface WaveShapeAndDetunePanelProps
{
    // the index of the SingleWaveform that this panel will be modifying
    editedWaveformIndex: number;
}

const mainLogger: Logger<ILogObj> = new Logger({ name: "WaveShapeAndDetunePanel" });

export function WaveShapeAndDetunePanel(props: WaveShapeAndDetunePanelProps): JSX.Element
{
    const dispatch = useDispatch();

    const onChangeStartOctaveDetune = (octave: number) =>
    {
        mainLogger.info("onChangeStartNoteDetuneOctave:  " + InfoLogMsg.UI_EVENT_START);

        if(AUDIO_SETTINGS.minOctaveDetune <= octave &&
            octave <= AUDIO_SETTINGS.maxOctaveDetune)
        {
            // 1. modify the currently edited waveform in the store
            dispatch(setCurrentEditedWaveformIndex(props.editedWaveformIndex));

            // 2. modify the 'start note detune' of that waveform in the store
            dispatch( setCurrentWaveformStartOctaveDetune(octave) );
        }
        else
            mainLogger.warn("onChangeStartNoteDetuneOctave: " + WarnLogMsg.ILLEGAL_ARG + " octave");
    };

    const onChangeStartSemitoneDetune = (semitone: number) =>
    {
        mainLogger.info("onChangeStartNoteDetuneSemitone: " + InfoLogMsg.UI_EVENT_START
            + ` semitone: ${semitone}`
        );

        if(AUDIO_SETTINGS.minSemitoneDetune <= semitone &&
            semitone <= AUDIO_SETTINGS.maxSemitoneDetune)
        {
            // 1. modify the currently edited waveform in the store
            dispatch(setCurrentEditedWaveformIndex(props.editedWaveformIndex));

            // mainLogger.info(`onChangeStartNoteDetuneSemitone: semitone: ${startNoteDetune.getSemitone()}`);

            // 2. modify the 'start note detune' of that waveform in the store
            dispatch( setCurrentWaveformStartSemitoneDetune(semitone) );
        }
        else
            mainLogger.warn("onChangeStartNoteDetuneSemitone: " + WarnLogMsg.ILLEGAL_ARG + " semitone");
    };

    const onChangeEndOctaveDetune = (octave: number) =>
    {
        mainLogger.info("onChangeEndNoteDetuneOctave: " + InfoLogMsg.UI_EVENT_START);

        if(AUDIO_SETTINGS.minOctaveDetune <= octave &&
            octave <= AUDIO_SETTINGS.maxOctaveDetune)
        {
            // 1. modify the currently edited waveform in the store
            dispatch(setCurrentEditedWaveformIndex(props.editedWaveformIndex));

            // 2. modify the 'start note detune' of that waveform in the store
            dispatch( setCurrentWaveformEndOctaveDetune(octave) );
        }
        else
            mainLogger.warn("onChangeEndNoteDetuneOctave: " + WarnLogMsg.ILLEGAL_ARG + " octave");
    };

    const onChangeEndSemitoneDetune = (semitone: number) =>
    {
        mainLogger.info("onChangeEndNoteDetuneSemitone:  " + InfoLogMsg.UI_EVENT_START);

        if(AUDIO_SETTINGS.minSemitoneDetune <= semitone &&
            semitone <= AUDIO_SETTINGS.maxSemitoneDetune)
        {
            // 1. modify the currently edited waveform in the store
            dispatch(setCurrentEditedWaveformIndex(props.editedWaveformIndex));

            // 2. modify the 'start note detune' of that waveform in the store
            dispatch( setCurrentWaveformEndSemitoneDetune(semitone) );
        }
        else
            mainLogger.warn("onChangeEndNoteDetuneSemitone: " + WarnLogMsg.ILLEGAL_ARG + " semitone");
    };

    return (
        <div className={styles.horizontalContainer}>

            <div className={styles.verticalContainer}>
                <div className={styles.label}>Waveform start</div>
                <WaveformSelector label="Shape"
                    editedWaveformIndex={props.editedWaveformIndex}
                    editedSide={WaveformSide.Start}>
                </WaveformSelector>

                <div className={styles.paramsContainer}>
                    <NumControl minValue={-2} maxValue={2} initialValue={AUDIO_SETTINGS.defaultOctaveDetune}
                        integerOnly={true}
                        label="Octave" radius={18}
                        onValChangeHandler={onChangeStartOctaveDetune}>
                    </NumControl>

                    <NumControl minValue={-12} maxValue={12} initialValue={AUDIO_SETTINGS.defaultSemitoneDetune}
                        integerOnly={true}
                        label="Semitone" radius={18}
                        onValChangeHandler={onChangeStartSemitoneDetune}>
                    </NumControl>
                </div>
            </div>

            <div className={styles.verticalContainer}>
                <div className={styles.label}>Waveform end</div>
                <WaveformSelector label="Shape"
                    editedWaveformIndex={props.editedWaveformIndex}
                    editedSide={WaveformSide.End}>
                </WaveformSelector>
                
                <div className={styles.paramsContainer}>
                    <NumControl minValue={-2} maxValue={2} initialValue={AUDIO_SETTINGS.defaultOctaveDetune}
                        integerOnly={true}
                        label="Octave" radius={18}
                        onValChangeHandler={onChangeEndOctaveDetune}>
                    </NumControl>

                    <NumControl minValue={-12} maxValue={12} initialValue={AUDIO_SETTINGS.defaultSemitoneDetune}
                        integerOnly={true}
                        label="Semitone" radius={18}
                        onValChangeHandler={onChangeEndSemitoneDetune}>
                    </NumControl>
                </div>
            </div>

        </div>
    );
}
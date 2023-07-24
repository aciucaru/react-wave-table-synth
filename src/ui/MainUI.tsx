import { WaveformPreview } from "./wave-editor/WaveformPreview";
import { WaveformStepEditor } from "./wave-editor/WaveformStepEditor";
import { WaveShapeAndDetunePanel } from "./wave-editor/WaveShapeAndDetunePanel";
import { WaveTablePreview } from "./wave-editor/WaveTablePreview";
import { KeyPad } from "./keypad/KeyPad";

import styles from "./MainUI.module.css"
import { PersonalProfilePanel } from "./personal-profile/PersonalProfilePanel";

export function MainUI(): JSX.Element
{
    const startWaveformIndex = 0;
    const endWaveformIndex = 1;

    return (
        <div className={styles.mainContainer}>
            <div className={styles.startWaveformPreview}>
                <div className={styles.label}>Waveform 1 preview</div>
                <WaveformPreview editedWaveformIndex={startWaveformIndex} drawnWave={2}></WaveformPreview>
            </div>

            <div className={styles.startWaveformEditor}>
                <div className={styles.label}>Amplitude editor</div>
                <WaveformStepEditor editedWaveformIndex={startWaveformIndex}></WaveformStepEditor>
            </div>

            <div className={styles.startWaveformShapeAndDetune}>
                <WaveShapeAndDetunePanel editedWaveformIndex={startWaveformIndex}></WaveShapeAndDetunePanel>
            </div>

            <div className={styles.endWaveformPreview}>
                <div className={styles.label}>Waveform 2 preview</div>
                <WaveformPreview editedWaveformIndex={endWaveformIndex} drawnWave={2}></WaveformPreview>
            </div>

            <div className={styles.endWaveformEditor}>
                <div className={styles.label}>Amplitude editor</div>
                <WaveformStepEditor editedWaveformIndex={endWaveformIndex}></WaveformStepEditor>
            </div>

            <div className={styles.endWaveformShapeAndDetune}>
                <WaveShapeAndDetunePanel editedWaveformIndex={endWaveformIndex}></WaveShapeAndDetunePanel>
            </div>

            <div className={styles.waveTablePreview}>
                <div className={styles.label}>Wavetable</div>
                <WaveTablePreview></WaveTablePreview>
            </div>

            <div className={styles.keyPad}>
                <KeyPad></KeyPad>
            </div>

            <div className={styles.personalProfilePanel}>
                <PersonalProfilePanel></PersonalProfilePanel>
            </div>
        </div>
    );
}
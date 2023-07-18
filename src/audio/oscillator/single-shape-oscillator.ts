import { WaveformShape } from "../basic-data/waveform-shape";
import { Note } from "../basic-data/note";

import { AUDIO_SETTINGS } from "../service/audio-settings";

import { Logger, ILogObj } from "tslog";
import { InfoLogMsg } from "../../log/info-log-messages";
import { WarnLogMsg } from "../../log/warn-log-messages";

export class SingleShapeOscillator
{
    // class properties:
    private waveShape: WaveformShape;
    private discreteAmplitudesArray: Array<number>

    private startOctaveDetune: number = 0;
    private startSemitoneDetune: number = 0;

    private endOctaveDetune: number = 0;
    private endSemitoneDetune: number = 0;

    // private speedFactor: number;
    private note: Note;

    private startNote: Note;
    private endNote: Note;

    private startFrequency: number = 1.0;
    private endFrequency: number = 1.0;

    private static mainLogger: Logger<ILogObj> = new Logger({ name: SingleShapeOscillator.name });

    public constructor(
                            waveShape: WaveformShape,
                            note: Note,
                            discreteAmplitudesArray: Array<number>,
                            startOctaveDetune: number, startSemitoneDetune: number,
                            endOctaveDetune: number, endSemitoneDetune: number,
                            speedFactor: number
                        )
    {
        const subLogger = SingleShapeOscillator.mainLogger.getSubLogger({ name: "constructor" });
		subLogger.info(InfoLogMsg.CONSTRUCTOR_START);

        const debugMessage = `startOctaveDetune: ${startOctaveDetune} startSemitoneDetune: ${startSemitoneDetune}` +
                                ` endOctaveDetune: ${endOctaveDetune} endSemitoneDetune: ${endSemitoneDetune}` +
                                ` noteSemitone: ${note.getSemitone()} speedFactor: ${speedFactor}`;
        subLogger.debug(debugMessage);

        if(waveShape != null)
            this.waveShape = waveShape;
        else
            subLogger.warn(WarnLogMsg.NULL_ARG + ': waveshape');

        if(note != null)
            this.note = note;
        else
            subLogger.warn(WarnLogMsg.NULL_ARG + ": note");

        if(discreteAmplitudesArray != null)
            this.discreteAmplitudesArray = discreteAmplitudesArray;
        else
            subLogger.warn(WarnLogMsg.NULL_ARG + ': discreteAmplitudesArray');
        
        if(AUDIO_SETTINGS.minOctaveDetune <= startOctaveDetune
            && startOctaveDetune <= AUDIO_SETTINGS.maxOctaveDetune)
            this.startOctaveDetune = startOctaveDetune;
        else
            subLogger.warn(WarnLogMsg.ILLEGAL_ARG + `: startOctaveDetune: ${startOctaveDetune}`);

        if(AUDIO_SETTINGS.minSemitoneDetune <= startSemitoneDetune
            && startSemitoneDetune <= AUDIO_SETTINGS.maxSemitoneDetune)
            this.startSemitoneDetune = startSemitoneDetune;
        else
            subLogger.warn(WarnLogMsg.ILLEGAL_ARG + `: startSemitoneDetune: ${startSemitoneDetune}`);

        if(AUDIO_SETTINGS.minOctaveDetune <= endOctaveDetune
            && endOctaveDetune <= AUDIO_SETTINGS.maxOctaveDetune)
            this.endOctaveDetune = endOctaveDetune;
        else
            subLogger.warn(WarnLogMsg.ILLEGAL_ARG + `: endOctaveDetune: ${endOctaveDetune} `);

        if(AUDIO_SETTINGS.minSemitoneDetune <= endSemitoneDetune
            && endSemitoneDetune <= AUDIO_SETTINGS.maxSemitoneDetune)
            this.endSemitoneDetune = endSemitoneDetune;
        else
            subLogger.warn(WarnLogMsg.ILLEGAL_ARG + `: endSemitoneDetune: ${endSemitoneDetune}`);

        this.setFrequencies();
    }

    private setFrequencies(): void
    {
        const subLogger = SingleShapeOscillator.mainLogger.getSubLogger({ name: "calculateAudioParams" });
		subLogger.info(InfoLogMsg.FUNCTION_START);

        // audio params:
        this.startNote = new Note(this.note.getData());
        this.startNote.setOctaveDetune(this.startOctaveDetune);
        this.startNote.setSemitoneDetune(this.startSemitoneDetune);
        this.startFrequency = this.startNote.getFrequency();

        subLogger.debug(`startFrequency: ${this.startFrequency}`);

        this.endNote = new Note(this.note.getData());
        this.endNote.setOctaveDetune(this.endOctaveDetune);
        this.endNote.setSemitoneDetune(this.endSemitoneDetune);
        this.endFrequency = this.endNote.getFrequency();

        subLogger.debug(`endFrequency: ${this.endFrequency}`);
    }

    private calcAmplitude(sampleIndex: number, sampleCount: number): number
    {
        let amplitude: number = 1.0;
        let currentX: number = 0.0;

        if(0 <= sampleIndex && sampleIndex < sampleCount)
        {
            currentX = sampleIndex / sampleCount;
            // the step coresponding to the waveformLengthPercentage
            // it is a number of steps (usually not an integer)
            const waveformStep = AUDIO_SETTINGS.discreteAmplitudesStepCount * currentX;

            // find the first integer number of step smaller than 'waveformStep'
            const lowerIntegerStep = Math.floor(waveformStep);

            // find the first integer number of step larger than 'waveformStep'
            const upperIntegerStep = Math.ceil(waveformStep);

            const lowerAmplitude = this.discreteAmplitudesArray[lowerIntegerStep];
            const upperAmplitude = this.discreteAmplitudesArray[upperIntegerStep];

            // find the amplitude corresponding to 'waveformStep'
            const deltaAmplitude = upperAmplitude - lowerAmplitude;
            const deltaStep = upperIntegerStep - lowerIntegerStep;
            const lineSlope = deltaAmplitude / deltaStep;
            amplitude = lineSlope * (waveformStep - lowerIntegerStep) + lowerAmplitude;
        }

        return amplitude;
    };

    public tickAllAndFillBuffer(buffer: Array<number>, startIndex: number,  fillLength: number): void
    {
        const sampleCount: number = fillLength - startIndex;
        const frequencySlope = (this.endFrequency - this.startFrequency) / sampleCount;

        // loop variables (they will change every iteration):
        let frequency: number =  this.startFrequency;
        let deltaX: number = this.startFrequency / AUDIO_SETTINGS.sampleRate;
        let xVal: number = 0.0;
        let yVal: number = 0.0;
        let amplitude: number = 0.0;

        for(let i=0; i<sampleCount; i++)
        {
            frequency = frequencySlope * i + this.startFrequency
            deltaX = frequency / AUDIO_SETTINGS.sampleRate;

            amplitude = this.calcAmplitude(i, sampleCount);

            switch(this.waveShape)
            {
                case WaveformShape.SINE:
                    yVal = amplitude * Math.sin(2*Math.PI * xVal);
                    break;

                case WaveformShape.TRIANGLE:
                    yVal = 2 * amplitude / Math.PI * Math.asin( Math.sin(2*Math.PI * xVal) );
                    break;

                case WaveformShape.SQUARE:
                    yVal = amplitude * Math.sign( Math.sin(2*Math.PI * xVal) );
                    break;

                case WaveformShape.SAW:
                    yVal = 2 * amplitude / Math.PI * Math.atan( 1.0 / Math.tan(Math.PI * xVal) );
                    break;

                default:
                    yVal = 1.0;
                    break;
            }
            buffer[i + startIndex] = yVal;

            xVal += deltaX;
        }
    }

    public setWaveShape(waveShape: WaveformShape): void
    {
        const subLogger = SingleShapeOscillator.mainLogger.getSubLogger({ name: "setWaveShape" });
        subLogger.info(InfoLogMsg.FUNCTION_START);

        if(waveShape != null)
        {
            this.waveShape = waveShape;
            this.setFrequencies(); // recalculate all audio parameters
        }
        else
            subLogger.warn(WarnLogMsg.NULL_ARG + ": waveShape");
    }

    public setDiscreteAmplitudesArray(amplitudesArray: Array<number>): void
    {
        const subLogger = SingleShapeOscillator.mainLogger.getSubLogger({ name: "setDiscreteAmplitudesArray" });
        subLogger.info(InfoLogMsg.FUNCTION_START);

        if(amplitudesArray != null)
        {
            this.discreteAmplitudesArray = amplitudesArray;
            this.setFrequencies(); // recalculate all audio parameters
        }
        else
            subLogger.warn(WarnLogMsg.NULL_ARG + ": setDiscreteAmplitudesArray");
    }

    public setStartOctaveDetune(octaveDetune: number): void
    {
        const subLogger = SingleShapeOscillator.mainLogger.getSubLogger({ name: "setStartOctaveDetune" });
        subLogger.info(InfoLogMsg.FUNCTION_START);

        if(AUDIO_SETTINGS.minOctaveDetune <= octaveDetune
            && octaveDetune <= AUDIO_SETTINGS.maxOctaveDetune)
        {
            this.startOctaveDetune = octaveDetune;
            this.setFrequencies(); // recalculate all audio parameters
        }
        else
            subLogger.warn(WarnLogMsg.ILLEGAL_ARG + ": octaveDetune");
    }

    public setStartSemitoneDetune(semitoneDetune: number): void
    {
        const subLogger = SingleShapeOscillator.mainLogger.getSubLogger({ name: "setStartSemitoneDetune" });
        subLogger.info(InfoLogMsg.FUNCTION_START);

        if(AUDIO_SETTINGS.minSemitoneDetune <= semitoneDetune
            && semitoneDetune <= AUDIO_SETTINGS.maxSemitoneDetune)
        {
            this.startSemitoneDetune = semitoneDetune;
            this.setFrequencies(); // recalculate all audio parameters
        }
        else
            subLogger.warn(WarnLogMsg.ILLEGAL_ARG + ": semitoneDetune");
    }

    public setEndOctaveDetune(octaveDetune: number): void
    {
        const subLogger = SingleShapeOscillator.mainLogger.getSubLogger({ name: "setEndOctaveDetune" });
        subLogger.info(InfoLogMsg.FUNCTION_START);

        if(AUDIO_SETTINGS.minOctaveDetune <= octaveDetune
            && octaveDetune <= AUDIO_SETTINGS.maxOctaveDetune)
        {
            this.endOctaveDetune = octaveDetune;
            this.setFrequencies(); // recalculate all audio parameters
        }
        else
            subLogger.warn(WarnLogMsg.ILLEGAL_ARG + ": octaveDetune");
    }

    public setEndSemitoneDetune(semitoneDetune: number): void
    {
        const subLogger = SingleShapeOscillator.mainLogger.getSubLogger({ name: "setEndSemitoneDetune" });
        subLogger.info(InfoLogMsg.FUNCTION_START);

        if(AUDIO_SETTINGS.minSemitoneDetune <= semitoneDetune
            && semitoneDetune <= AUDIO_SETTINGS.maxSemitoneDetune)
        {
            this.endSemitoneDetune = semitoneDetune;
            this.setFrequencies(); // recalculate all audio parameters
        }
        else
            subLogger.warn(WarnLogMsg.ILLEGAL_ARG + ": semitoneDetune");
    }

    public setNote(note: Note): void
    {
        const subLogger = SingleShapeOscillator.mainLogger.getSubLogger({ name: "setNote" });
        subLogger.info(InfoLogMsg.FUNCTION_START);

        if(note != null)
        {
            this.note = note;
            this.setFrequencies(); // recalculate all audio parameters
        }
        else
            subLogger.warn(WarnLogMsg.NULL_ARG + ": note");
    }
}
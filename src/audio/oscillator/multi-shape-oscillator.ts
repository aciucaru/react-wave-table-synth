import { SingleWaveform } from "../wavetable/single-waveform";
import { SingleShapeOscillator } from "./single-shape-oscillator";

import { Note } from "../basic-data/note";
import { AUDIO_SETTINGS } from "../service/audio-settings";

import { Logger, ILogObj } from "tslog";
import { InfoLogMsg } from "../../log/info-log-messages";
import { WarnLogMsg } from "../../log/warn-log-messages";

export class MultiShapeOscillator
{
    // class properties:
    private mainWaveform: SingleWaveform;
    private note: Note;
    private temporaryValuesBuffer: Array<number>;

    // audio params:
    private startShapeOscillator: SingleShapeOscillator;
    private endShapeOscillator: SingleShapeOscillator;

    private static readonly SINGLE_WAVEFORM_MAX_SAMPLE_COUNT = AUDIO_SETTINGS.sampleRate * AUDIO_SETTINGS.singleWaveformDuration;

    private static mainLogger: Logger<ILogObj> = new Logger({ name: MultiShapeOscillator.name });

    public constructor(mainWaveform: SingleWaveform, note: Note, speedFactor: number)
    {
        const subLogger = MultiShapeOscillator.mainLogger.getSubLogger({ name: "constructor" });
		subLogger.info(InfoLogMsg.CONSTRUCTOR_START);

        subLogger.debug(`noteSemitone: ${note.getSemitone()}, speedFactor: ${speedFactor}`);

        if(mainWaveform != null)
            this.mainWaveform = mainWaveform;
        else
		    subLogger.warn(WarnLogMsg.NULL_ARG + ": mainWaveform");

        if(note != null)
            this.note = note;
        else
            subLogger.warn(WarnLogMsg.NULL_ARG + ": note");

        this.temporaryValuesBuffer = new Array<number>(MultiShapeOscillator.SINGLE_WAVEFORM_MAX_SAMPLE_COUNT);

        this.setOscillators();
    }

    public setOscillators(): void
    {
        this.startShapeOscillator =
            new SingleShapeOscillator(
                this.mainWaveform.getStartShape(),
                this.note,
                this.mainWaveform.getAmplitudesArray(),
                this.mainWaveform.getStartOctaveDetune(), this.mainWaveform.getStartSemitoneDetune(),
                this.mainWaveform.getEndOctaveDetune(), this.mainWaveform.getEndSemitoneDetune(),
                1
            );

        this.endShapeOscillator =
            new SingleShapeOscillator(
                this.mainWaveform.getEndShape(),
                this.note,
                this.mainWaveform.getAmplitudesArray(),
                this.mainWaveform.getStartOctaveDetune(), this.mainWaveform.getStartSemitoneDetune(),
                this.mainWaveform.getEndOctaveDetune(), this.mainWaveform.getEndSemitoneDetune(),
                1
            );
    }

    public tickAllAndFillBuffer(startShapebuffer: Array<number>, startIndex: number,  fillLength: number): void
    {
        const subLogger = MultiShapeOscillator.mainLogger.getSubLogger({ name: "tickAll" });
		subLogger.info(InfoLogMsg.FUNCTION_START);

        if(startShapebuffer != null)
        {
            const sampleCount: number = fillLength - startIndex;

            if(startShapebuffer.length <= sampleCount
                && this.temporaryValuesBuffer.length <= sampleCount)
            {
                this.startShapeOscillator.tickAllAndFillBuffer(startShapebuffer, startIndex, fillLength);
                this.endShapeOscillator.tickAllAndFillBuffer(this.temporaryValuesBuffer, startIndex, fillLength);

                let xVal: number = 0.0;
                let yVal1: number = 0.0;
                let yVal2: number = 0.0;
                let yVal: number = 0.0;
                for(let i=0; i<sampleCount; i++)
                {
                    xVal = i / sampleCount;
                    yVal1 = startShapebuffer[i + startIndex];
                    yVal2 = this.temporaryValuesBuffer[i + startIndex];
                    yVal = yVal1 * (1.0 - xVal) + yVal2 * xVal;

                    startShapebuffer[i + startIndex] = yVal;
                }
            }
            else
                subLogger.warn(WarnLogMsg.ILLEGAL_ARG + ": buffer has zero elements");
        }
    }
}
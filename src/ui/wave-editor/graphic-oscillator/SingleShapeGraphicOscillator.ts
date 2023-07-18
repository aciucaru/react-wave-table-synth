import { WaveformShape } from "../../../audio/basic-data/waveform-shape";
import { AUDIO_SETTINGS } from "../../../audio/service/audio-settings";

import { Logger, ILogObj } from "tslog";
import { InfoLogMsg } from "../../../log/info-log-messages";
import { WarnLogMsg } from "../../../log/warn-log-messages";

import { AUDIO_CONSTANTS } from "../../../audio/service/audio-constants";

export class SingleShapeGraphicOscillator
{
    // class properties:
    private readonly waveShape: WaveformShape;
    private readonly discreteAmplitudesArray: Array<number>

    private readonly startOctaveDetune: number = 0.0;
    private readonly startSemitoneDetune: number = 0.0;

    private readonly endOctaveDetune: number = 0.0;
    private readonly endSemitoneDetune: number = 0.0;

    private readonly frequencyFactor1: number = 1.0;
    private readonly frequencyFactor2: number = 1.0;

    private readonly cyclesCount: number;
    private readonly linesPerCycle: number;

    // constants:
    private readonly SAMPLE_COUNT: number;
    private readonly DELTA_X_NORMALIZED: number ;
    private readonly FREQUENCY_SLOPE: number = 1.0;
    private readonly ANGULAR_FREQUENCY: number = 1.0;

    // loop variables (they change every thick() call):
    private currentIncrement: number = 0;

    private currentFrequencyFactor: number = 0.0;

    private currentXValRadians: number = 0.0;
    // private currentDeltaXRadians: number;

    private currentXValNormalized: number = 0.0;
    private currentYValNormalized: number = 0.0;

    private currentAmplitude: number = 0.0;

    private static mainLogger: Logger<ILogObj> = new Logger({ name: SingleShapeGraphicOscillator.name });

    public constructor(
                            waveShape: WaveformShape,
                            discreteAmplitudesArray: Array<number>,
                            startOctaveDetune: number, startSemitoneDetune: number,
                            endOctaveDetune: number, endSemitoneDetune: number,
                            cyclesCount:number, linesPerCycle:number
                        )
    {
        const subLogger = SingleShapeGraphicOscillator.mainLogger.getSubLogger({ name: "constructor" });
		subLogger.info(InfoLogMsg.CONSTRUCTOR_START);

        if(waveShape != null)
            this.waveShape = waveShape;
        else
            subLogger.warn(WarnLogMsg.NULL_ARG + ': waveshape');

        if(discreteAmplitudesArray != null)
            this.discreteAmplitudesArray = discreteAmplitudesArray;
        else
            subLogger.warn(WarnLogMsg.NULL_ARG + ': discreteAmplitudesArray');

        if(AUDIO_SETTINGS.minOctaveDetune <= startOctaveDetune
            && startOctaveDetune <= AUDIO_SETTINGS.maxOctaveDetune)
            this.startOctaveDetune = startOctaveDetune;
        else
            subLogger.warn(WarnLogMsg.ILLEGAL_ARG + ': startOctaveDetune');

        if(AUDIO_SETTINGS.minSemitoneDetune <= startSemitoneDetune
            && startSemitoneDetune <= AUDIO_SETTINGS.maxSemitoneDetune)
            this.startSemitoneDetune = startSemitoneDetune;
        else
            subLogger.warn(WarnLogMsg.ILLEGAL_ARG + ': startSemitoneDetune');

        if(AUDIO_SETTINGS.minOctaveDetune <= endOctaveDetune
            && endOctaveDetune <= AUDIO_SETTINGS.maxOctaveDetune)
            this.endOctaveDetune = endOctaveDetune;
        else
            subLogger.warn(WarnLogMsg.ILLEGAL_ARG + ': endOctaveDetune');

        if(AUDIO_SETTINGS.minSemitoneDetune <= endSemitoneDetune
            && endSemitoneDetune <= AUDIO_SETTINGS.maxSemitoneDetune)
            this.endSemitoneDetune = endSemitoneDetune;
        else
            subLogger.warn(WarnLogMsg.ILLEGAL_ARG + ': endSemitoneDetune');

        this.frequencyFactor1 = Math.pow(AUDIO_CONSTANTS.semitoneRatio, 12 * this.startOctaveDetune)
                                * Math.pow(AUDIO_CONSTANTS.semitoneRatio, this.startSemitoneDetune);

        this.frequencyFactor2 = Math.pow(AUDIO_CONSTANTS.semitoneRatio, 12 * this.endOctaveDetune)
                                * Math.pow(AUDIO_CONSTANTS.semitoneRatio, this.endSemitoneDetune);

        if(cyclesCount > 0)
            this.cyclesCount = cyclesCount;
        else
            subLogger.warn(WarnLogMsg.ILLEGAL_ARG + ': cyclesCount');

        if(linesPerCycle > 0)
            this.linesPerCycle = linesPerCycle;
        else
            subLogger.warn(WarnLogMsg.ILLEGAL_ARG + ': linesPerCycle'); 

        this.SAMPLE_COUNT = this.cyclesCount * this.linesPerCycle;
        this.DELTA_X_NORMALIZED= 1.0 / this.SAMPLE_COUNT;

        this.FREQUENCY_SLOPE = (this.frequencyFactor2 - this.frequencyFactor1) / this.SAMPLE_COUNT;
        this.ANGULAR_FREQUENCY = 2*Math.PI* this.cyclesCount;

        this.currentFrequencyFactor = this.frequencyFactor1;
        // this.currentDeltaXRadians = this.currentFrequencyFactor / this.SAMPLE_COUNT;
    }

    private calcAmplitude(xVal: number): number
    {
        // const subLogger = GraphicOscillator.mainLogger.getSubLogger({ name: "calcAmplitude" });

        let amplitude = 1.0;

        if(0.0 <= xVal && xVal <= 1.0)
        {
            // the step coresponding to the waveformLengthPercentage
            // it is a number of step (usually a non integer)
            const waveformStep = AUDIO_SETTINGS.discreteAmplitudesStepCount * xVal;

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
        // else
        //     subLogger.warn(WarnLogMsg.ILLEGAL_ARG + ` xVal: ${xVal}`);

        return amplitude;
    };

    public tick(): number
    {
        // const subLogger = GraphicOscillator.mainLogger.getSubLogger({ name: "tick" });
        this.currentFrequencyFactor = this.FREQUENCY_SLOPE * this.currentIncrement + this.frequencyFactor1;
        // this.currentDeltaXRadians = this.currentFrequencyFactor / this.SAMPLE_COUNT;
        
        this.currentXValNormalized = this.currentIncrement * this.DELTA_X_NORMALIZED;
        this.currentAmplitude = this.calcAmplitude(this.currentXValNormalized);

        switch(this.waveShape)
        {
            case WaveformShape.SINE:
                this.currentYValNormalized = this.currentAmplitude * Math.sin(this.ANGULAR_FREQUENCY * this.currentXValRadians);
                break;

            case WaveformShape.TRIANGLE:
                this.currentYValNormalized = 2 * this.currentAmplitude / Math.PI * Math.asin( Math.sin(this.ANGULAR_FREQUENCY * this.currentXValRadians) );
                break;

            case WaveformShape.SQUARE:
                this.currentYValNormalized = this.currentAmplitude * Math.sign( Math.sin(this.ANGULAR_FREQUENCY * this.currentXValRadians) );
                break;

            case WaveformShape.SAW:
                this.currentYValNormalized = 2 * this.currentAmplitude / Math.PI * Math.atan( 1.0 / Math.tan(this.ANGULAR_FREQUENCY/2.0 * this.currentXValRadians) );
                break;

            default:
                this.currentYValNormalized = 1.0;
                break;
        }

        this.currentIncrement++;
        this.currentXValRadians += this.currentFrequencyFactor / this.SAMPLE_COUNT;

        return this.currentYValNormalized;
    }

    public reset(): void
    {
        const subLogger = SingleShapeGraphicOscillator.mainLogger.getSubLogger({ name: "reset" });
        subLogger.info(InfoLogMsg.FUNCTION_START)

        this.currentIncrement = 0;
        this.currentXValRadians = 0;
    }
}
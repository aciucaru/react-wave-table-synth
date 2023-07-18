import { SingleWaveformData } from "../../../audio/wavetable/single-waveform";
import { SingleShapeGraphicOscillator } from "./SingleShapeGraphicOscillator";

import { Logger, ILogObj } from "tslog";
import { InfoLogMsg } from "../../../log/info-log-messages";
import { WarnLogMsg } from "../../../log/warn-log-messages";

export class MultiShapeGraphicOscillator
{
    // class properties:
    private readonly mainWaveform: SingleWaveformData;
    private readonly cyclesCount: number;
    private readonly linesPerCycle: number;
    private readonly startShapeOscillator: SingleShapeGraphicOscillator;
    private readonly endShapeOscillator: SingleShapeGraphicOscillator;

    // constants:
    private readonly PREVIEW_SAMPLE_COUNT: number;
    private readonly DELTA_X_NORMALIZED: number;

    // loop variables (they change every thick() call):
    private currentIncrement: number = 0;
    private currentXValNormalized: number = 0.0;
    private currentYValNormalized: number = 0.0;

    private static mainLogger: Logger<ILogObj> = new Logger({ name: MultiShapeGraphicOscillator.name });

    public constructor(mainWaveform: SingleWaveformData, cyclesCount:number, linesPerCycle:number)
    {
        this.cyclesCount = cyclesCount;
        this.linesPerCycle = linesPerCycle;

        this.PREVIEW_SAMPLE_COUNT = this.cyclesCount * this.linesPerCycle;
        this.DELTA_X_NORMALIZED = 1.0 / this.PREVIEW_SAMPLE_COUNT;

        if(mainWaveform != null)
        {
            this.mainWaveform = mainWaveform;

            this.startShapeOscillator = new SingleShapeGraphicOscillator(
                                                mainWaveform.startShape,
                                                mainWaveform.discreteAmplitudesArray,
                                                mainWaveform.startOctaveDetune, mainWaveform.startSemitoneDetune,
                                                mainWaveform.endOctaveDetune, mainWaveform.endSemitoneDetune,
                                                this.cyclesCount, this.linesPerCycle
                                            );

            this.endShapeOscillator = new SingleShapeGraphicOscillator(
                                                mainWaveform.endShape,
                                                mainWaveform.discreteAmplitudesArray,
                                                mainWaveform.startOctaveDetune, mainWaveform.startSemitoneDetune,
                                                mainWaveform.endOctaveDetune, mainWaveform.endSemitoneDetune,
                                                this.cyclesCount, this.linesPerCycle
                                            );
        }
    }

    public tick(): number
    {
        this.currentXValNormalized = this.currentIncrement * this.DELTA_X_NORMALIZED;

        if(this.mainWaveform.startShape !== this.mainWaveform.endShape)
        {
            let startShapeAmplitude = this.startShapeOscillator.tick();
            let endShapeAmplitude = this.endShapeOscillator.tick();

            this.currentYValNormalized = startShapeAmplitude * (1.0 - this.currentXValNormalized)
                                    + endShapeAmplitude * this.currentXValNormalized;
        }
        else
            this.currentYValNormalized = this.startShapeOscillator.tick();

        this.currentIncrement++;

        return this.currentYValNormalized;
    }

    public tickAll(numberOfTicks: number): Array<number>
    {
        const subLogger = MultiShapeGraphicOscillator.mainLogger.getSubLogger({ name: "tickAll" });
		subLogger.info(InfoLogMsg.FUNCTION_START);

        if(numberOfTicks >= 0)
        {
            const yValuesArray: Array<number> = new Array<number>(numberOfTicks);

            for(let i=0; i<numberOfTicks; i++)
            {
                yValuesArray[i] = this.tick();
            }

            this.reset();

            return yValuesArray;
        }
        else
        {
            subLogger.warn(WarnLogMsg.ILLEGAL_ARG + `numberOfTicks: ${numberOfTicks}`);

            this.reset();

            return new Array<number>(0);
        }
    }

    public reset(): void
    {
        this.currentIncrement = 0;
        this.startShapeOscillator.reset();
        this.endShapeOscillator.reset();
    }
}
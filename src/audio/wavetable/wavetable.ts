import { SingleWaveform, SingleWaveformData } from "./single-waveform";

import { AUDIO_SETTINGS } from "../service/audio-settings";

import { Logger, ILogObj } from "tslog";
import { InfoLogMsg } from "../../log/info-log-messages";
import { WarnLogMsg } from "../../log/warn-log-messages";

export interface WaveTableData
{
    waveformArray: Array<SingleWaveformData>
	intermediateWavesCount: number;
}

export class WaveTable
{
    private mainWaveformsArray: Array<SingleWaveform>;
    private static mainWaveformCount = 2;

    private totalWavformsCount: number;

    private static mainLogger: Logger<ILogObj> = new Logger({ name: WaveTable.name });

	constructor(name: string, data?: WaveTableData)
    {
        const subLogger = WaveTable.mainLogger.getSubLogger({ name: "constructor" });
        subLogger.info(InfoLogMsg.CONSTRUCTOR_START);

        if(data)
        {
            if(WaveTable.mainWaveformCount <= data.waveformArray.length)
            {
                for(let i=0; i<WaveTable.mainWaveformCount; i++)
                {
                    this.mainWaveformsArray[i] = new SingleWaveform(`waveform ${i}`, data.waveformArray[i]);
                }
            }
            else
                subLogger.info(WarnLogMsg.ILLEGAL_ARG + "data.waveformArray is shorter than internal array");

            this.totalWavformsCount = AUDIO_SETTINGS.defaultWaveformCount;
        }
        else
        {
            this.mainWaveformsArray = new Array<SingleWaveform>(WaveTable.mainWaveformCount);
            for(let i=0; i<WaveTable.mainWaveformCount; i++)
            {
                this.mainWaveformsArray[i] = new SingleWaveform(`waveform ${i}`);
            }

            this.totalWavformsCount = AUDIO_SETTINGS.defaultWaveformCount;
        }
    }

    public setMainWaveform(index: number, mainWave: SingleWaveform): void
    {
        const subLogger = WaveTable.mainLogger.getSubLogger({ name: "setMainWave1" });
        subLogger.info(InfoLogMsg.SETTER_START);

        if(0 <= index && index <WaveTable.mainWaveformCount && mainWave != null)
            this.mainWaveformsArray[index] = mainWave;
        else
            subLogger.warn(WarnLogMsg.NULL_ARG);
    }

    public setTotalWaveformsCount(totalWaveformsCount: number): void
    {
        const subLogger = WaveTable.mainLogger.getSubLogger({ name: "setTotalWavformsCount" });
        subLogger.info(InfoLogMsg.SETTER_START);

        if(1 <= totalWaveformsCount
            && totalWaveformsCount <= AUDIO_SETTINGS.defaultWaveformCount)
            this.totalWavformsCount = totalWaveformsCount;
        else
            subLogger.warn(WarnLogMsg.ILLEGAL_ARG);
    }

    public setData(data: WaveTableData): void
    {
        const subLogger = WaveTable.mainLogger.getSubLogger({ name: "setData" });
        subLogger.info(InfoLogMsg.SETTER_START);

        if(data != null)
        {
            if(WaveTable.mainWaveformCount <= data.waveformArray.length)
            {
                for(let i=0; i<WaveTable.mainWaveformCount; i++)
                {
                    this.mainWaveformsArray[i] = new SingleWaveform(`waveform ${i}`, data.waveformArray[i]);
                }
            }
            else
                subLogger.info(WarnLogMsg.ILLEGAL_ARG + "data.waveformArray is shorter than internal array");

            this.setTotalWaveformsCount(data.intermediateWavesCount);
        }
        else
            subLogger.warn(WarnLogMsg.NULL_ARG);
    }

    public getMainWave(index: number): SingleWaveform | null
    { 
        const subLogger = WaveTable.mainLogger.getSubLogger({ name: "getMainWave" });
        subLogger.info(InfoLogMsg.GETTER_START);

        if(0 <= index && index < WaveTable.mainWaveformCount)
            return this.mainWaveformsArray[index];
        else
        {
            subLogger.warn(WarnLogMsg.ILLEGAL_ARG + "index is out of bounds");
            return null;
        }
    }

    public getFirstMainWave(): SingleWaveform | null
    { 
        const subLogger = WaveTable.mainLogger.getSubLogger({ name: "getMainWave" });
        subLogger.info(InfoLogMsg.GETTER_START);

        if(this.mainWaveformsArray.length > 0)
            return this.mainWaveformsArray[0];
        else
        {
            subLogger.warn(WarnLogMsg.ILLEGAL_INTERNAL_STATE + ": mainWaveformsArray has zero elements");
            return null;
        }
    }

    public getLastMainWave(): SingleWaveform | null
    { 
        const subLogger = WaveTable.mainLogger.getSubLogger({ name: "getMainWave" });
        subLogger.info(InfoLogMsg.GETTER_START);

        if(this.mainWaveformsArray.length > 0)
            return this.mainWaveformsArray[this.mainWaveformsArray.length - 1];
        else
        {
            subLogger.warn(WarnLogMsg.ILLEGAL_INTERNAL_STATE + ": mainWaveformsArray has zero elements");
            return null;
        }
    }

    public getTotalWaveformsCount(): number { return this.totalWavformsCount; }

    public getData(): WaveTableData
    {
        const data: WaveTableData =
        {
            waveformArray: this.mainWaveformsArray.map(waveform => waveform.getData()),
            intermediateWavesCount: this.totalWavformsCount,
        }

        return data;
    }
}
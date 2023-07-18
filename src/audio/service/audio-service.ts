import { WaveTableSynth } from "../wavetable/wavetable-synth";

import { Logger, ILogObj } from "tslog";
import { InfoLogMsg } from "../../log/info-log-messages";

export class AudioService
{
    private static _instance: AudioService;
    private audioContext: AudioContext;
    private audioSynth: WaveTableSynth;

    private static mainLogger: Logger<ILogObj> = new Logger({ name: AudioService.name });

    private constructor()
    {
        const subLogger = AudioService.mainLogger.getSubLogger({ name: "constructor" });
		subLogger.info(InfoLogMsg.CONSTRUCTOR_START);

        this.audioContext = new AudioContext();

        this.audioSynth = new WaveTableSynth("Program 1", this.audioContext);
    }

    public static getSingleton(): AudioService
    {
        const subLogger = AudioService.mainLogger.getSubLogger({ name: "getSingleton" });
		subLogger.info(InfoLogMsg.GETTER_START);

        if(AudioService._instance == null)
            AudioService._instance = new AudioService();

        return AudioService._instance;
    }

    public getWaveTableSynth(): WaveTableSynth {  return this.audioSynth; }
}
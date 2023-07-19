import { Note, NoteData } from "../basic-data/note";
import { WaveTable, WaveTableData } from "./wavetable";
import { MultiShapeOscillator } from "../oscillator/multi-shape-oscillator";

import { AUDIO_SETTINGS } from "../service/audio-settings";

import { ILogObj, Logger } from "tslog";
import { InfoLogMsg } from "../../log/info-log-messages";
import { WarnLogMsg } from "../../log/warn-log-messages";

export interface WaveTableSynthData
{
    waveTable: WaveTableData;
}

export class WaveTableSynth
{
    private waveTable: WaveTable;


    private audioContext: AudioContext;

    private startAmplitudeBuffer: Array<number>;
    private endAmplitudeBuffer: Array<number>
    private allWaveformsAudioBuffer: AudioBuffer;

    private startOscillator: MultiShapeOscillator;
    private endOscillator: MultiShapeOscillator;

    private currentNote: Note;

    private singleWaveformSampleCount: number;

    // constants:
    private readonly SINGLE_WAVEFORM_MAX_SAMPLE_COUNT: number;
    private readonly ALL_WAVEFORMS_MAX_SAMPLE_COUNT: number;

    private static mainLogger: Logger<ILogObj> = new Logger({ name: WaveTableSynth.name });

    public constructor(name: string, audioContext: AudioContext)
    {
        const subLogger = WaveTableSynth.mainLogger.getSubLogger({ name: "constructor" });
		subLogger.info(InfoLogMsg.CONSTRUCTOR_START);

        if(audioContext != null)
            this.audioContext = audioContext;
        else
            subLogger.warn(WarnLogMsg.NULL_ARG + ": audioContext");

        this.currentNote = new Note( {semitone: 28, octaveDetune: 0, semitoneDetune: 0} );

        this.singleWaveformSampleCount = this.audioContext.sampleRate * AUDIO_SETTINGS.singleWaveformDuration;
        
        this.SINGLE_WAVEFORM_MAX_SAMPLE_COUNT = this.audioContext.sampleRate * AUDIO_SETTINGS.singleWaveformDuration;
        this.ALL_WAVEFORMS_MAX_SAMPLE_COUNT = this.audioContext.sampleRate * AUDIO_SETTINGS.singleWaveformDuration * AUDIO_SETTINGS.defaultWaveformCount;

        this.waveTable = new WaveTable("audio prog wavetable");

        this.startAmplitudeBuffer = new Array<number>(this.SINGLE_WAVEFORM_MAX_SAMPLE_COUNT);
        this.endAmplitudeBuffer = new Array<number>(this.SINGLE_WAVEFORM_MAX_SAMPLE_COUNT);

        this.allWaveformsAudioBuffer = this.audioContext.createBuffer(
                                                                    AUDIO_SETTINGS.numOfChannels,
                                                                    this.SINGLE_WAVEFORM_MAX_SAMPLE_COUNT,
                                                                    this.audioContext.sampleRate
                                                                );
        this.calculateAudioParams();
    }

    private calculateAudioParams(): void
    {
        const subLogger = WaveTableSynth.mainLogger.getSubLogger({ name: "calculateAudioParams" });
		subLogger.info(InfoLogMsg.FUNCTION_START);

        const firstMainWave = this.waveTable.getFirstMainWave();
        if(firstMainWave != null)
            this.startOscillator = new MultiShapeOscillator(firstMainWave, this.currentNote, 1);
        else
            subLogger.warn(WarnLogMsg.NULL_INTERNAL_STATE + ": firstMainWave");
        
        const lastMainWave = this.waveTable.getLastMainWave();
        if(lastMainWave != null)
            this.endOscillator = new MultiShapeOscillator(lastMainWave, this.currentNote, 1);
        else
            subLogger.warn(WarnLogMsg.NULL_INTERNAL_STATE + ": lastMainWave");
    }

    private calcAndFillAmpBuffers(): void
    {
        const subLogger = WaveTableSynth.mainLogger.getSubLogger({ name: "calcAndFillAmpBuffers" });
        subLogger.info(InfoLogMsg.FUNCTION_START);

        const loggMsg1 = `currentNote: ${this.currentNote.getSemitone()}`;
        subLogger.debug(loggMsg1);

        this.calculateAudioParams(); // TO DO: continue?
        
        this.startOscillator.tickAllAndFillBuffer(this.startAmplitudeBuffer, 0, this.singleWaveformSampleCount);
        this.endOscillator.tickAllAndFillBuffer(this.endAmplitudeBuffer, 0, this.singleWaveformSampleCount);
    }

    public noteOn(note: NoteData): void
    {
        const subLogger = WaveTableSynth.mainLogger.getSubLogger({ name: "noteOn" });
		subLogger.info(InfoLogMsg.FUNCTION_START);

        if(note != null)
        {
            subLogger.debug(`noteSemitone: ${note.semitone}`);

            this.currentNote = new Note(note);
            this.calcAndFillAmpBuffers();

            const TOTAL_WAVEFORMS_COUNT: number = this.waveTable.getTotalWaveformsCount();
    
            let bufferSourceNode: AudioBufferSourceNode;
            let currentChannelBuffer: Float32Array;
            let gainNode: GainNode;
            
            bufferSourceNode = this.audioContext.createBufferSource();
            bufferSourceNode.buffer = this.allWaveformsAudioBuffer;

            gainNode = this.audioContext.createGain();

            bufferSourceNode.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
    
            let xVal: number = 0.0;
            let yStartVal: number = 0.0;
            let yEndVal: number = 0.0;
            let yFinalVal: number = 0.0;

            // iterate trough all the waveforms (including 'start' and 'end' waveforms)
            for(let waveformIndex=0; waveformIndex<TOTAL_WAVEFORMS_COUNT; waveformIndex++)
            {
                for(let channel=0; channel<AUDIO_SETTINGS.numOfChannels; channel++)
                {
                    currentChannelBuffer = this.allWaveformsAudioBuffer.getChannelData(channel);

                    // calculate and fill the buffer with the amplitudes of the current waveform
                    // the same buffer is reused for every wavform of the wavetable
                    for(let i=0; i<this.singleWaveformSampleCount; i++)
                    {
                        xVal = waveformIndex/TOTAL_WAVEFORMS_COUNT;
                        yStartVal = this.startAmplitudeBuffer[i];
                        yEndVal = this.endAmplitudeBuffer[i];
                        yFinalVal = yStartVal * (1.0 - xVal) + yEndVal * xVal;

                        // set the actual amplitudes for waveform of index 'waveformIndex'
                        currentChannelBuffer[waveformIndex * TOTAL_WAVEFORMS_COUNT + i] = yFinalVal;
                    }
                }
            }

            // set gain (volume) to 70%
            gainNode.gain.setValueAtTime(0.7, this.audioContext.currentTime);

            // start audiobuffer node, this actually plays the synthesized sound
            const ALL_WAVEFORMS_DURATION = AUDIO_SETTINGS.singleWaveformDuration * TOTAL_WAVEFORMS_COUNT;
            bufferSourceNode.start(this.audioContext.currentTime, 0, ALL_WAVEFORMS_DURATION);
        }
        else
            subLogger.warn(WarnLogMsg.NULL_ARG + ": note");
    }

    public getWaveTable(): WaveTable { return this.waveTable; }
}


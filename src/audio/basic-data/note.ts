import { AUDIO_CONSTANTS } from "../service/audio-constants";
import { AUDIO_SETTINGS } from "../service/audio-settings";

import { ILogObj, Logger } from "tslog";
import { InfoLogMsg } from "../../log/info-log-messages";
import { WarnLogMsg } from "../../log/warn-log-messages";


// ************************ Note data interface and logic class ***************
export interface NoteData
{
    semitone: number;
    octaveDetune: number;
    semitoneDetune: number;
}

export class Note
{
    private semitone: number;
    private octaveDetune: number;
    private semitoneDetune: number;

	private static mainLogger: Logger<ILogObj> = new Logger({ name: Note.name });

	public constructor(data?: NoteData)
	{
		const subLogger = Note.mainLogger.getSubLogger({ name: "constructor" });
        subLogger.info(InfoLogMsg.CONSTRUCTOR_START);

        if(data)
        {
            subLogger.debug(`semitone: ${data.semitone}, octaveDetune: ${data.octaveDetune}, semitoneDetune: ${data.semitoneDetune}`);

            this.semitone = data.semitone;
            this.octaveDetune = data.octaveDetune;
            this.semitoneDetune = data.semitoneDetune;
        }
        else
        {
            this.semitone = 1;
            this.octaveDetune = 0;
            this.semitoneDetune = 0;
        }
	}

	public setSemitone(semitone: number): void
	{
		const subLogger = Note.mainLogger.getSubLogger({ name: "setSemitone" });
        subLogger.info(InfoLogMsg.SETTER_START + `: semitone: ${semitone}`);

		if(AUDIO_SETTINGS.minPlayableSemitone <= semitone &&
			semitone <= AUDIO_SETTINGS.maxPlayableSemitone)
			this.semitone = semitone;
        else
            subLogger.warn(WarnLogMsg.ILLEGAL_ARG + `: semitone: ${semitone}`);
	}

    public setOctaveDetune(octaveDetune: number): void
    {
        const subLogger = Note.mainLogger.getSubLogger({ name: "setOctaveDetune" });
        subLogger.info(InfoLogMsg.SETTER_START + `: octaveDetune: ${octaveDetune}`);

        if(AUDIO_SETTINGS.minOctaveDetune <= octaveDetune
            && octaveDetune <= AUDIO_SETTINGS.maxOctaveDetune)
            this.octaveDetune = octaveDetune;
        else
            subLogger.warn(WarnLogMsg.ILLEGAL_ARG + `: octaveDetune: ${octaveDetune}`);
    }

    public setSemitoneDetune(semitoneDetune: number): void
    {
        const subLogger = Note.mainLogger.getSubLogger({ name: "setSemitoneDetune" });
        subLogger.info(InfoLogMsg.SETTER_START + `: semitoneDetune: ${semitoneDetune}`);

        if(AUDIO_SETTINGS.minSemitoneDetune <= semitoneDetune
            && semitoneDetune <= AUDIO_SETTINGS.maxSemitoneDetune)
            this.semitoneDetune = semitoneDetune;
        else
            subLogger.warn(WarnLogMsg.ILLEGAL_ARG + `: semitoneDetune: ${semitoneDetune}`);
    }

	public setData(data: NoteData): void
	{
		const subLogger = Note.mainLogger.getSubLogger({ name: "setData" });
        subLogger.info(InfoLogMsg.SETTER_START);

		if(data != null)
		{
			this.setSemitone(data.semitone);
            this.setOctaveDetune(data.octaveDetune);
            this.setSemitoneDetune(data.semitoneDetune);
		}
	}

	public getSemitone(): number { return this.semitone; }
    public getOctaveDetune(): number { return this.octaveDetune; }
    public getSemitoneDetune(): number { return this.semitoneDetune; }

	public getData(): NoteData
	{
		const data: NoteData =
		{
			// octave: this.octave,
			semitone: this.semitone,
            octaveDetune: this.octaveDetune,
            semitoneDetune: this.semitoneDetune
		};

		return data;
	}

    public getRelativeFreqFactor(): number
    {
        const subLogger = Note.mainLogger.getSubLogger({ name: "getRelativeFreqFactor" });

        const totalSemitones = this.semitone + 12 * this.octaveDetune + this.semitoneDetune
                                - AUDIO_CONSTANTS.referenceNoteSemitone;
        const freqFactor: number = Math.pow(AUDIO_CONSTANTS.semitoneRatio, totalSemitones);

        subLogger.debug(`semitone: ${this.semitone}, finalSemitone: ${totalSemitones}, freqFactor: ${freqFactor}`);

        return freqFactor;
    }

    public getFrequency(): number
    {
        const totalSemitones = this.semitone + 12 * this.octaveDetune + this.semitoneDetune
                                - AUDIO_CONSTANTS.referenceNoteSemitone;
        return Math.pow(AUDIO_CONSTANTS.semitoneRatio, totalSemitones) * AUDIO_CONSTANTS.referenceNoteFrequency;
    }
}
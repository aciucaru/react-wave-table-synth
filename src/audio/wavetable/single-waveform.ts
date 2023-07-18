import { Note, NoteData } from "../basic-data/note";
import { WaveformShape } from "../basic-data/waveform-shape";

import { AUDIO_SETTINGS } from "../service/audio-settings";

import { Logger, ILogObj } from "tslog";
import { InfoLogMsg } from "../../log/info-log-messages";
import { WarnLogMsg } from "../../log/warn-log-messages";

// ************************ StaticWave data interface and logic class ***************
// instances of this interface/class are considered audio resources
export interface SingleWaveformData
{
    startShape: WaveformShape;
    startNoteDetune: NoteData;
    startOctaveDetune: number;
    startSemitoneDetune: number;

    endShape: WaveformShape;
    endNoteDetune: NoteData;
    endOctaveDetune: number;
    endSemitoneDetune: number;

    discreteAmplitudesArray: Array<number>;
}

export class SingleWaveform
{
    private startShape: WaveformShape;
    private startNoteDetune: Note;
    private startOctaveDetune: number;
    private startSemitoneDetune: number;

    private endShape: WaveformShape;
    private endNoteDetune: Note;
    private endOctaveDetune: number;
    private endSemitoneDetune: number;

    private amplitudesArray: Array<number>;

	private static mainLogger: Logger<ILogObj> = new Logger({ name: SingleWaveform.name });

	public constructor(name: string, data?: SingleWaveformData)
	{
		const subLogger = SingleWaveform.mainLogger.getSubLogger({ name: "constructor" });
		subLogger.info(InfoLogMsg.CONSTRUCTOR_START);

        if(data)
        {
			this.startShape = data.startShape;
            this.startNoteDetune = new Note(data.startNoteDetune);
            this.startOctaveDetune = 0;
            this.startSemitoneDetune = 0;

            this.endShape = data.endShape;
            this.endNoteDetune = new Note(data.endNoteDetune);
            this.endOctaveDetune = 0;
            this.endSemitoneDetune = 0;

            this.amplitudesArray = data.discreteAmplitudesArray;
        }
        else
        {
			this.startShape = WaveformShape.SINE;
            this.startNoteDetune = new Note();
            this.startOctaveDetune = 0;
            this.startSemitoneDetune = 0;

            this.endShape = WaveformShape.SINE;
            this.endNoteDetune = new Note();
            this.endOctaveDetune = 0;
            this.endSemitoneDetune = 0;

            this.amplitudesArray = new Array<number>(AUDIO_SETTINGS.discreteAmplitudesStepCount);
            this.amplitudesArray.fill(0.5);
        }
	}

    public setStartShape(shape: WaveformShape): void
    {
        const subLogger = SingleWaveform.mainLogger.getSubLogger({ name: "setStartShape" });
		subLogger.info(InfoLogMsg.SETTER_START);

        if(shape != null)
            this.startShape = shape;
        else
            subLogger.warn(WarnLogMsg.NULL_ARG + ': shape');
    }

    public setStartNoteDetune(note: Note): void
    {
        const subLogger = SingleWaveform.mainLogger.getSubLogger({ name: "setStartNoteDetune" });

        if(note != null)
        {
            subLogger.info(InfoLogMsg.SETTER_START + ` semitone: ${note.getSemitone()}`);

            this.startNoteDetune = note;
        }
        else
            subLogger.warn(WarnLogMsg.NULL_ARG + ': note');
    }

    public setStartOctaveDetune(octaveDetune: number): void
    {
        const subLogger = SingleWaveform.mainLogger.getSubLogger({ name: "setStartOctaveDetune" });

        if(AUDIO_SETTINGS.minOctaveDetune <= octaveDetune
            && octaveDetune <= AUDIO_SETTINGS.maxOctaveDetune)
            this.startOctaveDetune = octaveDetune;
        else
            subLogger.warn(WarnLogMsg.ILLEGAL_ARG + ": octaveDetune");
    }
    
    setStartSemitoneDetune(semitoneDetune: number): void
    {
        const subLogger = SingleWaveform.mainLogger.getSubLogger({ name: "setStartSemitoneDetune" });

        if(AUDIO_SETTINGS.minSemitoneDetune <= semitoneDetune
            && semitoneDetune <= AUDIO_SETTINGS.maxSemitoneDetune)
            this.startSemitoneDetune = semitoneDetune;
        else
            subLogger.warn(WarnLogMsg.ILLEGAL_ARG + ": octaveDetune");
    }

    public setEndShape(shape: WaveformShape): void
    {
        const subLogger = SingleWaveform.mainLogger.getSubLogger({ name: "setEndShape" });
		subLogger.info(InfoLogMsg.SETTER_START);

        if(shape != null)
            this.endShape = shape;
        else
            subLogger.warn(WarnLogMsg.NULL_ARG + ': shape');
    }

    public setEndNoteDetune(note: Note): void
    {
        const subLogger = SingleWaveform.mainLogger.getSubLogger({ name: "setEndNoteDetune" });
		subLogger.info(InfoLogMsg.SETTER_START);

        if(note != null)
            this.endNoteDetune = note;
        else
            subLogger.warn(WarnLogMsg.NULL_ARG + ': note');
    }

    public setEndOctaveDetune(octaveDetune: number): void
    {
        const subLogger = SingleWaveform.mainLogger.getSubLogger({ name: "setEndOctaveDetune" });

        if(AUDIO_SETTINGS.minOctaveDetune <= octaveDetune
            && octaveDetune <= AUDIO_SETTINGS.maxOctaveDetune)
            this.endOctaveDetune = octaveDetune;
        else
            subLogger.warn(WarnLogMsg.ILLEGAL_ARG + ": octaveDetune");
    }
    
    setEndSemitoneDetune(semitoneDetune: number): void
    {
        const subLogger = SingleWaveform.mainLogger.getSubLogger({ name: "setEndSemitoneDetune" });

        if(AUDIO_SETTINGS.minSemitoneDetune <= semitoneDetune
            && semitoneDetune <= AUDIO_SETTINGS.maxSemitoneDetune)
            this.endSemitoneDetune = semitoneDetune;
        else
            subLogger.warn(WarnLogMsg.ILLEGAL_ARG + ": octaveDetune");
    }

    public setAmplitudesArray(stepArray: Array<number>): void
    {
        const subLogger = SingleWaveform.mainLogger.getSubLogger({ name: "setAmplitudesArray" });
		subLogger.info(InfoLogMsg.SETTER_START);

		if(stepArray != null)
			this.amplitudesArray = stepArray;
		else
			subLogger.warn(WarnLogMsg.NULL_ARG);
    }

	public setData(data: SingleWaveformData): void
	{
		const subLogger = SingleWaveform.mainLogger.getSubLogger({ name: "setData" });
		subLogger.info(InfoLogMsg.SETTER_START);

		if(data != null)
		{
            this.setStartShape(data.startShape);
            this.setStartNoteDetune(new Note(data.startNoteDetune));

            this.setEndShape(data.endShape);
            this.setEndNoteDetune(new Note(data.endNoteDetune));
		}
		else
			subLogger.warn(WarnLogMsg.NULL_ARG);
	}

    public getStartShape(): WaveformShape { return this.startShape; }
    public getStartNoteDetune(): Note { return this.startNoteDetune; }
    public getStartOctaveDetune(): number { return this.startOctaveDetune; }
    public getStartSemitoneDetune(): number { return this.startSemitoneDetune; }

    public getEndShape(): WaveformShape { return this.endShape; }
    public getEndNoteDetune(): Note { return this.endNoteDetune; }
    public getEndOctaveDetune(): number { return this.endOctaveDetune; }
    public getEndSemitoneDetune(): number { return this.endSemitoneDetune; }

	public getAmplitudesArray(): Array<number> { return this.amplitudesArray }

    public getData(): SingleWaveformData
	{
		const data: SingleWaveformData =
		{
            startShape: this.startShape,
            startNoteDetune: this.startNoteDetune.getData(),
            startOctaveDetune: this.startOctaveDetune,
            startSemitoneDetune: this.startSemitoneDetune,
        
            endShape: this.endShape,
            endNoteDetune: this.endNoteDetune.getData(),
            endOctaveDetune: this.endOctaveDetune,
            endSemitoneDetune: this.endSemitoneDetune,
        
            discreteAmplitudesArray: this.amplitudesArray
		}

		return data;
	}
}
export interface AudioConstants
{
    semitoneRatio: number;
    referenceNoteSemitone: number;
    referenceNoteFrequency: number;
}

export const AUDIO_CONSTANTS: AudioConstants =
{
    semitoneRatio: Math.pow(2, 1.0/12),
    // reference note is A4 (A440), the 49th note, corresponding to 440 Hertz frequency
    referenceNoteSemitone: 49,
    referenceNoteFrequency: 440 // the frequency coresponding to the reference note
};
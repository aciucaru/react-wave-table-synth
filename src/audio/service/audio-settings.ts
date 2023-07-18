export interface AudioSettings
{
    discreteAmplitudesStepCount: number; // the number of discrete amplitudes (bars) in a waveform

    minPlayableOctave: number;
    maxPlayableOctave: number;

    minPlayableSemitone: number;
    maxPlayableSemitone: number;

    minOctaveDetune: number;
    maxOctaveDetune: number;
    defaultOctaveDetune: number;

    minSemitoneDetune: number;
    maxSemitoneDetune: number;
    defaultSemitoneDetune: number;

    sampleRate: number;
    numOfChannels: number;

    defaultWaveformCount: number;
    singleWaveformDuration: number; // measured in seconds
}

export const AUDIO_SETTINGS: AudioSettings =
{
    discreteAmplitudesStepCount: 64, // the number of discrete amplitudes (bars) in a waveform

    minPlayableOctave: 0,
    maxPlayableOctave: 10,

    minPlayableSemitone: 0,
    maxPlayableSemitone: 87,

    minOctaveDetune: -4,
    maxOctaveDetune: 4,
    defaultOctaveDetune: 0,

    minSemitoneDetune: -12,
    maxSemitoneDetune: 12,
    defaultSemitoneDetune: 0,

    sampleRate: 44100,
    numOfChannels: 2, // stereo mode (left and right channel)

    defaultWaveformCount: 8,
    singleWaveformDuration: 0.5 // 500 miliseconds
};






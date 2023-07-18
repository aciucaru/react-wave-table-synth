export interface UISettings
{
	digitalDisplayHue: number;

	waveformEditorStepWidth: number;
    waveformEditorStepHeight: number;
    waveformEditorStepGap: number;

    waveformPreviewCyclesCount: number;
    waveformPreviewLinesPerCycle: number;

    wavetablePreviewCyclesCount: number;
    wavetablePreviewLinesPerCycle: number;
    wavetablePreviewStepFullWidth: number;
    wavetablePreviewHeight: number;
    wavetableFullXOffset: number;
    waveformYOverlappFactor: number;
    waveformYSkew: number;

}

export const UI_SETTINGS: UISettings =
{
	digitalDisplayHue: 200,

	waveformEditorStepWidth: 6,
    waveformEditorStepHeight: 80,
    waveformEditorStepGap: 4,

    waveformPreviewCyclesCount: 20,
    waveformPreviewLinesPerCycle: 100, // need high resolution for saw wave

    wavetablePreviewCyclesCount: 16,
    wavetablePreviewLinesPerCycle: 40,
    wavetablePreviewStepFullWidth: 8,
    wavetablePreviewHeight: 320,
    wavetableFullXOffset: 200,
    waveformYOverlappFactor: 0.2,
    waveformYSkew: 70
};
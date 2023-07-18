import { AUDIO_SETTINGS } from "../../audio/service/audio-settings";
import { UI_SETTINGS } from "./ui-setting";

export interface UIDimemsions
{
    waveformStepFullWidth: number;
    waveformPreviewStepWidth: number;
    waveformPreviewWidth: number;
    waveformPreviewHeight: number;

    wavetablePreviewStepWidth: number;
    wavetablePreviewWidth: number;
}

// needs rework
export function calculateUIDimensions(): UIDimemsions
{
    const stepCount = AUDIO_SETTINGS.discreteAmplitudesStepCount;

    const waveformStepFullWidth = UI_SETTINGS.waveformEditorStepWidth + UI_SETTINGS.waveformEditorStepGap;
    const waveformPreviewWidth = stepCount * waveformStepFullWidth;
    const waveformPreviewStepWidth = waveformStepFullWidth/ UI_SETTINGS.waveformPreviewLinesPerCycle;
    const waveformPreviewHeight = UI_SETTINGS.waveformEditorStepHeight;

    const wavetablePreviewWidth = stepCount * UI_SETTINGS.wavetablePreviewStepFullWidth;
    const wavetablePreviewStepWidth = UI_SETTINGS.wavetablePreviewStepFullWidth / UI_SETTINGS.wavetablePreviewLinesPerCycle;

    return {
        waveformStepFullWidth: waveformStepFullWidth,
        waveformPreviewStepWidth: waveformPreviewStepWidth,
        waveformPreviewWidth: waveformPreviewWidth,
        waveformPreviewHeight: waveformPreviewHeight,

        wavetablePreviewWidth: wavetablePreviewWidth,
        wavetablePreviewStepWidth: wavetablePreviewStepWidth,
    };
}
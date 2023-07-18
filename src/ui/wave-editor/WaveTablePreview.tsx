import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

import { SingleWaveformData } from "../../audio/wavetable/single-waveform";
import { MultiShapeGraphicOscillator } from "./graphic-oscillator/MultiShapeGraphicOscillator";
import { AUDIO_SETTINGS } from "../../audio/service/audio-settings";

import { DigitalDisplayFrame } from "../decorations/DigitalDisplayFrame";
import { calculateUIDimensions } from "../ui-settings/ui-utils";
import { UI_SETTINGS } from "../ui-settings/ui-setting";

import styles from "./WaveformPreview.module.css"

export interface WaveTablePreviewProps
{
    children?: any;
}

export function WaveTablePreview(props: WaveTablePreviewProps): JSX.Element
{
    // very important, 'null' has to be passed as arg, so we don't get 'undefined' error
    const waveformPreviewCanvasRef = React.useRef<HTMLCanvasElement>(null);

    const mainWaveformsArray: Array<SingleWaveformData>
        = useSelector( (state: RootState) => state.waveTableEditReducers.mainWaveformsArray );

    const totalWavesCount: number = AUDIO_SETTINGS.defaultWaveformCount;

    const startWaveform = mainWaveformsArray[0];
    const endWaveform = mainWaveformsArray[1];

    const startWaveformOscillator = new MultiShapeGraphicOscillator(startWaveform, UI_SETTINGS.wavetablePreviewCyclesCount, UI_SETTINGS.wavetablePreviewLinesPerCycle);
    const endWaveformOscillator = new MultiShapeGraphicOscillator(endWaveform, UI_SETTINGS.wavetablePreviewCyclesCount, UI_SETTINGS.wavetablePreviewLinesPerCycle);

    const previewSampleCount = UI_SETTINGS.wavetablePreviewCyclesCount * UI_SETTINGS.wavetablePreviewLinesPerCycle;

    const dims = calculateUIDimensions();

    const WIDTH = dims.wavetablePreviewWidth;
    const HEIGHT = UI_SETTINGS.wavetablePreviewHeight;

    const backgroundStyle = `linear-gradient(
                                                135deg,
                                                rgb(40, 40, 40),
                                                rgb(25, 25, 25) 10%,
                                                rgb(15, 15, 15) 30%,
                                                rgb(10, 10, 10)
                                            )`;

    const drawSingleWaveform = (context2D: CanvasRenderingContext2D, index: number) =>
    {
        const startHue = 190;
        const endHue = 300;
        let finalHue = startHue;

        const WAVEFORM_X_OFFSET = UI_SETTINGS.wavetableFullXOffset / (totalWavesCount - 1);
        const SINGLE_WAVEFORM_WIDTH = WIDTH - UI_SETTINGS.wavetableFullXOffset;
        
        const SINGLE_WAVEFORM_HEIGHT = (HEIGHT - UI_SETTINGS.waveformYSkew) / ( (totalWavesCount - 1)
            * (1 - UI_SETTINGS.waveformYOverlappFactor) + 1);
        const WAVEFORM_Y_OFFSET = SINGLE_WAVEFORM_HEIGHT * (1 - UI_SETTINGS.waveformYOverlappFactor);

        const deltaXNormalized: number = 1.0 / previewSampleCount;
        let xValNormalized: number = 0.0;
        let yStartValNormalized: number = 0.0;
        let yEndValNormalized: number = 0.0;
        let yFinalValNormalized: number = 0.0;

        let currentYSkew = 0.0;

        let xDraw: number = index * WAVEFORM_X_OFFSET;
        let yDraw: number = (totalWavesCount - index - 1) * WAVEFORM_Y_OFFSET + SINGLE_WAVEFORM_HEIGHT / 2.0;

        // very important: start the path with beginPath(), otherwise we get overlappings
        context2D.beginPath();
        context2D.moveTo(xDraw, yDraw);
        for(let i=0; i<=previewSampleCount; i++)
        {
            xValNormalized = i * deltaXNormalized;
            yStartValNormalized = startWaveformOscillator.tick();
            yEndValNormalized = endWaveformOscillator.tick();
            yFinalValNormalized = (yEndValNormalized - yStartValNormalized) * index / (totalWavesCount - 1) + yStartValNormalized;

            currentYSkew = UI_SETTINGS.waveformYSkew * xValNormalized;
            xDraw = (index * WAVEFORM_X_OFFSET) + xValNormalized * SINGLE_WAVEFORM_WIDTH;
            yDraw = currentYSkew + (totalWavesCount - index - 1) * WAVEFORM_Y_OFFSET + SINGLE_WAVEFORM_HEIGHT / 2.0 + SINGLE_WAVEFORM_HEIGHT * yFinalValNormalized / 2.0;

            finalHue = (endHue - startHue) * index/totalWavesCount + startHue;
            context2D.strokeStyle = `hsl(${finalHue}, 90%, 70%)`;
            context2D.lineTo(xDraw, yDraw);
        }
        context2D.stroke();

        startWaveformOscillator.reset();
        endWaveformOscillator.reset();
    };

    const drawCanvas = (context2D: CanvasRenderingContext2D) =>
    {
        for(let i=0; i<totalWavesCount; i++)
        {
            drawSingleWaveform(context2D, i);
        }
    };

    React.useEffect( () =>
    {
        const context2D = waveformPreviewCanvasRef.current!.getContext("2d");

        const X_OFFSET = 0.5;
        const Y_OFFSET = 0.5;

        if (context2D != null)
        {
            context2D.clearRect(0, 0, WIDTH, HEIGHT);
            context2D.translate(X_OFFSET, Y_OFFSET);

            drawCanvas(context2D);

            context2D.translate((-1) * X_OFFSET, (-1) * Y_OFFSET);
        }
    }
);

    return (
        <div className={styles.mainContainer}>
            <DigitalDisplayFrame backgroundStyle={backgroundStyle}>
                <canvas ref={waveformPreviewCanvasRef} width={WIDTH} height={HEIGHT} className={styles.canvas}>
                </canvas>
            </DigitalDisplayFrame>
        </div>
    );
}
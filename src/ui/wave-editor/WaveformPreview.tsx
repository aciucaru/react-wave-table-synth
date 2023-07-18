import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

import { WaveformShape } from "../../audio/basic-data/waveform-shape";
import { SingleWaveformData } from "../../audio/wavetable/single-waveform";
import { MultiShapeGraphicOscillator } from "./graphic-oscillator/MultiShapeGraphicOscillator";

import { DigitalDisplayFrame } from "../decorations/DigitalDisplayFrame";
import { calculateUIDimensions } from "../ui-settings/ui-utils";
import { UI_SETTINGS } from "../ui-settings/ui-setting";

import styles from "./WaveformPreview.module.css";

export interface WaveformPreviewProps
{
    // the index of the SingleWaveform that this component will be previewing
    editedWaveformIndex: number;
    drawnWave: number;
}

export function WaveformPreview(props: WaveformPreviewProps): JSX.Element
{
    // very important, 'null' has to be passed as arg, so we don't get 'undefined' error
    const waveformPreviewCanvasRef = React.useRef<HTMLCanvasElement>(null);

    const mainWaveformsArray: Array<SingleWaveformData>
        = useSelector( (state: RootState) => state.waveTableEditReducers.mainWaveformsArray );

    let waveformIndex = 0;
    if(0 <= props.editedWaveformIndex && props.editedWaveformIndex < mainWaveformsArray.length)
        waveformIndex = props.editedWaveformIndex;
    else
        waveformIndex = 0; // safety value

    const mainWaveform = mainWaveformsArray[waveformIndex];

    const interpolatedOscillator = new MultiShapeGraphicOscillator(mainWaveform,
        UI_SETTINGS.waveformPreviewCyclesCount, UI_SETTINGS.waveformPreviewLinesPerCycle);

    const dims = calculateUIDimensions();
    const STEP_WIDTH = UI_SETTINGS.waveformEditorStepWidth;
    const STEP_FULL_WIDTH = dims.waveformStepFullWidth;
    const WIDTH = dims.waveformPreviewWidth;
    const HEIGHT = UI_SETTINGS.waveformEditorStepHeight;

    const X_OFFSET = 0.5;
    const Y_OFFSET = 0.5;

    const backgroundStyle = `linear-gradient(135deg,
        rgb(40, 40, 40),
        rgb(25, 25, 25) 10%,
        rgb(15, 15, 15) 30%,
        rgb(10, 10, 10)
        )`;

    const drawLinePositiveEvelope = (context2D: CanvasRenderingContext2D) =>
    {
        context2D.strokeStyle = `hsl(0, 0%, 30%)`;

        let currentAmplitude: number = mainWaveform.discreteAmplitudesArray[0];
        let x: number = 0.5 * STEP_WIDTH;
        let y: number = (HEIGHT * (1 - currentAmplitude)) / 2.0;

        // draw pozitive envelope
        // very important: start the path with beginPath(), otherwise we get overlappings
        context2D.beginPath();
        context2D.moveTo(x, y);
        for(let i=1; i<mainWaveform.discreteAmplitudesArray.length; i++)
        {
            currentAmplitude = mainWaveform.discreteAmplitudesArray[i];
            x = i * STEP_FULL_WIDTH + 0.5 * STEP_WIDTH;
            y = (HEIGHT * (1 - currentAmplitude)) / 2.0;

            context2D.lineTo(x, y);
        }
        context2D.stroke();
    };

    const drawLineNegativeEvelope = (context2D: CanvasRenderingContext2D) =>
    {
        context2D.strokeStyle = `hsl(0, 0%, 30%)`;

        let currentAmplitude: number = mainWaveform.discreteAmplitudesArray[0];
        let x: number = 0.5 * STEP_WIDTH;
        let y: number = HEIGHT / 2.0 + HEIGHT * currentAmplitude / 2.0;

        // draw negative envelope
        // very important: start the path with beginPath(), otherwise we get overlappings
        context2D.beginPath();
        context2D.moveTo(x, y);
        for(let i=1; i<mainWaveform.discreteAmplitudesArray.length; i++)
        {
            currentAmplitude = mainWaveform.discreteAmplitudesArray[i];
            x = i * STEP_FULL_WIDTH + 0.5 * STEP_WIDTH;
            y = HEIGHT / 2.0 + HEIGHT * currentAmplitude / 2.0;

            context2D.lineTo(x, y);
        }
        context2D.stroke();
    };

    const drawInterpolatedWave = (context2D: CanvasRenderingContext2D) =>
    {
        const sineWaveHue: number = 220.0;
        const triangleWaveHue: number = 130.0;
        const squareWaveHue: number = 300.0;
        const sawWaveHue: number = 30.0;

        let startShapeHue: number = sineWaveHue;
        let endShapeHue: number = sineWaveHue;

        switch(mainWaveform.startShape)
        {
            case WaveformShape.SINE:
                startShapeHue = sineWaveHue;
                break;
            
            case WaveformShape.TRIANGLE:
                startShapeHue = triangleWaveHue;
                break;

            case WaveformShape.SQUARE:
                startShapeHue = squareWaveHue;
                break;

            case WaveformShape.SAW:
                startShapeHue = sawWaveHue;
                break;
        }

        switch(mainWaveform.endShape)
        {
            case WaveformShape.SINE:
                endShapeHue = sineWaveHue;
                break;
            
            case WaveformShape.TRIANGLE:
                endShapeHue = triangleWaveHue;
                break;

            case WaveformShape.SQUARE:
                endShapeHue = squareWaveHue;
                break;

            case WaveformShape.SAW:
                endShapeHue = sawWaveHue;
                break;
        }

        const gradient = context2D.createLinearGradient(0, 0, WIDTH, HEIGHT);
        gradient.addColorStop(0, `hsl(${startShapeHue}, 70%, 65%)`);
        gradient.addColorStop(1, `hsl(${endShapeHue}, 70%, 65%)`);

        context2D.strokeStyle = gradient;

        const previewSampleCount = UI_SETTINGS.waveformPreviewCyclesCount * UI_SETTINGS.waveformPreviewLinesPerCycle;
        const deltaXNormalized: number = 1.0 / previewSampleCount;

        let xValNormalized: number = 0.0;
        let yValNormalized: number = 0.0;

        let xDraw: number = 0.0;
        let yDraw: number = (HEIGHT * (1 - yValNormalized)) / 2.0;

        // very important: start the path with beginPath(), otherwise we get overlappings
        context2D.beginPath();
        context2D.moveTo(xDraw, yDraw);
        for(let i=0; i<=previewSampleCount; i++)
        {
            xValNormalized = i * deltaXNormalized;
            yValNormalized = interpolatedOscillator.tick();

            xDraw = xValNormalized * WIDTH;
            yDraw = HEIGHT / 2.0 + HEIGHT * yValNormalized / 2.0;

            context2D.lineTo(xDraw, yDraw);
        }
        context2D.stroke();

        interpolatedOscillator.reset();
    };

    const drawAxis = (context2D: CanvasRenderingContext2D) =>
    {
        context2D.strokeStyle = `hsl(200, 50%, 30%)`;

        // very important: start the path with beginPath(), otherwise we get overlappings
        context2D.beginPath();
            context2D.moveTo(0, HEIGHT / 2.0);
            context2D.lineTo(WIDTH, HEIGHT / 2.0);
        context2D.stroke();
    };

    const drawCanvas = (context2D: CanvasRenderingContext2D) =>
    {
        drawLinePositiveEvelope(context2D);
        drawLineNegativeEvelope(context2D);
        drawAxis(context2D);

        drawInterpolatedWave(context2D);
    };

    React.useEffect( () =>
        {
            const context2D = waveformPreviewCanvasRef.current!.getContext("2d");

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
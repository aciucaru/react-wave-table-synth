import React, { useState } from "react";

import { Logger, ILogObj } from "tslog";

import { XYCoord } from "../../geometry/geometry";
import { calculateUIDimensions } from "../ui-settings/ui-utils";
import { UI_SETTINGS } from "../ui-settings/ui-setting";

import styles from "./SingleStepEditor.module.css";

export interface SingleStepEditorProps
{
    children?: any;
    index: number;
    onValChangeHandler?: (changedElementIndex: number, newAplitudeValue: number) => void;
}

const mainLogger: Logger<ILogObj> = new Logger({ name: "SingleBarEditor" });

export function SingleStepEditor(props: SingleStepEditorProps): JSX.Element
{
    // very important, 'null' has to be passed as arg, so we don't get 'undefined' error
    const waveEditorCanvasRef = React.useRef<HTMLCanvasElement>(null);

    const [stepHeightNormalized, setStepHeightNormalized] = useState(0.5);

    const dims = calculateUIDimensions();

    const STEP_WIDTH = UI_SETTINGS.waveformEditorStepWidth;
    const WIDTH = dims.waveformStepFullWidth;
    const HEIGHT = UI_SETTINGS.waveformEditorStepHeight;
    const X_OFFSET = 0.5;
    const Y_OFFSET = 0.5;

    const calcMouseRelativeXAndY = (event: React.MouseEvent<HTMLCanvasElement>) =>
    {
        // the canvas reactangle must be queryied as late as possible to make sure the canvas
        // has loaded, otherwise it doesn't work
        const canvasRect = waveEditorCanvasRef.current?.getBoundingClientRect() ||
        {
            x: 0,
            y: 0,
            height: 0,
            width: 0,
            bottom: 0,
            left: 0,
            right: 0,
            top: 0
        };

        let mouseX: number = event.clientX - canvasRect!.left;
        let mouseY: number = event.clientY - canvasRect!.top;

        let mouseRelativeCoord: XYCoord = { x: mouseX, y: mouseY };

        return mouseRelativeCoord;
    };

    const drawCanvas = (context2D: CanvasRenderingContext2D) =>
    {
        const barColor = `hsl(185, 50%, 50%)`;
        context2D.fillStyle = barColor;

        // draw one bar
        const barStartY = HEIGHT * (1 - stepHeightNormalized);
        const barHeight = HEIGHT * stepHeightNormalized;
        context2D.fillRect(0, barStartY, STEP_WIDTH, barHeight);
    };

    React.useEffect( () =>
        {
            const context2D = waveEditorCanvasRef.current!.getContext("2d");

            if (context2D != null)
            {
                context2D.clearRect(0, 0, WIDTH, HEIGHT);
                context2D.translate(X_OFFSET, Y_OFFSET);

                drawCanvas(context2D);

                context2D.translate((-1) * X_OFFSET, (-1) * Y_OFFSET);
            }
        }
    );

    const onMouseDownHandler = (event: React.MouseEvent<HTMLCanvasElement>) =>
    {
        const mouseClickXY: XYCoord = calcMouseRelativeXAndY(event);
        const barHeightNormalizedValue = (1.0 * (HEIGHT - mouseClickXY.y)) / (HEIGHT * 1.0);
        setStepHeightNormalized(barHeightNormalizedValue);

        // 'onValChangeHandler()' is a parent callback, which is called after each step modification
        if(props.onValChangeHandler != null)
            props.onValChangeHandler(props.index, barHeightNormalizedValue);

        mainLogger.info(`onMouseDownHandler: normVal: ${barHeightNormalizedValue} x: ${mouseClickXY.x} y: ${mouseClickXY.y}`);
    };

    const onMouseMoveHandler = (event: React.MouseEvent<HTMLCanvasElement>) =>
    {
        if(event.buttons === 1)
        {
            const mouseClickXY: XYCoord = calcMouseRelativeXAndY(event);
            const barHeightNormalizedValue = (1.0 * (HEIGHT - mouseClickXY.y)) / (HEIGHT * 1.0);
            
            setStepHeightNormalized(barHeightNormalizedValue);

            if(props.onValChangeHandler != null)
                props.onValChangeHandler(props.index, barHeightNormalizedValue);

            mainLogger.info(`onMouseMoveHandler: normVal: ${barHeightNormalizedValue}, x: ${mouseClickXY.x}, y: ${mouseClickXY.y}`);
        }
    };

    return (
        <div className={styles.mainContainer}>
            <canvas ref = {waveEditorCanvasRef}
                className = {styles.canvas}
                width = {WIDTH} height={HEIGHT}
                onClick = { (evt) => onMouseDownHandler(evt) }
                onMouseMove = { (evt) => onMouseMoveHandler(evt) }>
            </canvas>
        </div>
    );
}
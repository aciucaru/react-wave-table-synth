import React, { useState } from "react";

import { DigitalDisplayFrame } from "../decorations/DigitalDisplayFrame";

import { ILogObj, Logger } from "tslog";


import styles from "./NumControl.module.css";

export interface NumControlProps2
{
    children?: any;
    radius: number;

    integerOnly: boolean;
    step?: number;
    minValue: number;
    maxValue: number;
    initialValue: number;

    colorHue?: number;
    label?: string;

    // onValChangeHandler will be called by the Knob child component, which will pass it 
    // the new normalized value selected by the same child Knob component
    // then, NumericParamControl will use 'minValue' and 'maxValue' to calculate the denorm value
    onValChangeHandler?: (newValue: number) => void;
}

const mainLogger: Logger<ILogObj> = new Logger({ name: "NumControl" });

export function NumControl(props: NumControlProps2): JSX.Element
{
    // const initialValue = (props.maxValue - props.minValue)/2.0 + props.minValue;
    // const initialValue = props.initialValue;
    const [currentValue, setCurrentValue] = useState(Math.round(props.initialValue));
    const [currentNormValueForAngle, setCurrentValueForAngle] = useState(0.5);

    const integerOnly = props.integerOnly;
    const STEP = props.step || 1;

    const TRESHOLD = Math.pow(10, -6);

    const width = 2 * props.radius;
    const height = 1.75 * props.radius;

    const X_OFFSET = 0.5;
    const Y_OFFSET = 0.5;

    // values for arcs
    const outerRadius = props.radius-2;
    const trackWidth = 3;
    const innerRadius = outerRadius - trackWidth;
    const centerX = outerRadius;
    const centerY = outerRadius;
    const arcStartLimitAngle = Math.PI/2 + Math.PI/4;
    const arcEndLimitAngle = arcStartLimitAngle + Math.PI + Math.PI/2;
    let currentNormValAngle = arcStartLimitAngle + currentNormValueForAngle*(arcEndLimitAngle-arcStartLimitAngle);

    // values for outer shape connecting lines
    const pointInnerValueAngle = currentNormValAngle;
    const pointInnerValueX = centerX + Math.cos(pointInnerValueAngle)*innerRadius;
    const pointInnerValueY = centerY + Math.sin(pointInnerValueAngle)*innerRadius;

    const pointOuterStartAngle = Math.PI/2 + Math.PI/4;
    const pointOuterStartX = centerX + Math.cos(pointOuterStartAngle)*outerRadius;
    const pointOuterStartY = centerY + Math.sin(pointOuterStartAngle)*outerRadius;

    const pointInnerEndAngle = Math.PI/4;
    const pointInnerEndX = centerX + Math.cos(pointInnerEndAngle)*innerRadius;
    const pointInnerEndY = centerY + Math.sin(pointInnerEndAngle)*innerRadius;

    const OFFSET_ANGLE = 5*Math.PI/180; // 5 deg
    const currentValOffsetedAngle =  currentNormValAngle + OFFSET_ANGLE;
    const pointOuterValOffsetedX = centerX + Math.cos(currentValOffsetedAngle)*outerRadius;
    const pointOuterValOffsetedY = centerY + Math.sin(currentValOffsetedAngle)*outerRadius;

    // colors
    const colorHue: number = props.colorHue || 220;
    const trackColor = `hsl(${colorHue}, 100%, 60%)`;
    const remainingSpaceColor = `hsl(0, 0%, 40%)`;

    const drawTrack = (context2D: CanvasRenderingContext2D) =>
    {
        if(currentNormValAngle >= arcStartLimitAngle)
        {
            context2D.fillStyle = trackColor;
            context2D.beginPath();
                context2D.arc(centerX, centerY, outerRadius, arcStartLimitAngle, currentNormValAngle, false);
                context2D.lineTo(pointInnerValueX, pointInnerValueY);
                context2D.arc(centerX, centerY, innerRadius, currentNormValAngle, arcStartLimitAngle, true);
                context2D.lineTo(pointOuterStartX, pointOuterStartY);
            context2D.fill();
        }
    };

    const drawRemainingSpace = (context2D: CanvasRenderingContext2D) =>
    {
        if(currentValOffsetedAngle <= arcEndLimitAngle)
        {
            context2D.fillStyle = remainingSpaceColor;
            context2D.beginPath();
                context2D.arc(centerX, centerY, outerRadius, currentValOffsetedAngle, arcEndLimitAngle, false);
                context2D.lineTo(pointInnerEndX, pointInnerEndY);
                context2D.arc(centerX, centerY, innerRadius, arcEndLimitAngle, currentValOffsetedAngle, true);
                context2D.lineTo(pointOuterValOffsetedX, pointOuterValOffsetedY);
            context2D.fill();
        }
    };

    // foarte important, trebuie sa fie pasat 'null', ca sa nu fie eraore de tip 'undefined'
    const digitalKnobCanvasRef = React.useRef<HTMLCanvasElement>(null);
    React.useEffect( () =>
        {
            const context2D = digitalKnobCanvasRef.current!.getContext("2d");

            if(context2D != null)
            {
                context2D.clearRect(0, 0, width, height);
                context2D.translate(X_OFFSET, Y_OFFSET);

                drawTrack(context2D);
                drawRemainingSpace(context2D);

                context2D.translate((-1) * X_OFFSET, (-1) * Y_OFFSET);
            }
        }
    );

    const onWheelHandler = (event: React.WheelEvent<HTMLCanvasElement>) =>
    {
        mainLogger.info("onWheelHandler");

        let newVal: number = currentValue - STEP * Math.sign(event.deltaY);
        const isValueIncreasing = (-1) * STEP * Math.sign(event.deltaY) > 0;
        
        let newNormValue: number = (newVal - props.minValue) / (props.maxValue - props.minValue);

        mainLogger.debug(`newVal: ${newVal}`);

        if(props.minValue <= newVal && newVal <= props.maxValue)
        {
            if(integerOnly)
                setCurrentValue(Math.round(newVal));
            else
            // the value is being rounded to 1 decimal place
                setCurrentValue( Math.round((newVal + Number.EPSILON) * 10) / 10);

            if(props.onValChangeHandler != null)
                props.onValChangeHandler(Math.round(newVal));

            const ANGLE_OFFSET = 2*TRESHOLD;

            if(isValueIncreasing)
            {
                // console.log("INCREASING");
                if(newNormValue <= 1.0 + TRESHOLD)
                    setCurrentValueForAngle(newNormValue - ANGLE_OFFSET);
            }
            else
            {
                // console.log("DECREASING");
                if(0.0 - TRESHOLD <= newNormValue)
                    setCurrentValueForAngle(newNormValue + ANGLE_OFFSET);
            }

            // console.log(`deltaMode: ${event.deltaMode}`);
            // console.log(`deltaX: ${event.deltaX}`);
            // console.log(`deltaY: ${event.deltaY}`);
            // console.log(`deltaZ: ${event.deltaZ}`);
        }
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.label}>{props.label}</div>
            <DigitalDisplayFrame>
                <div className={styles.innerContainer}>
                    <canvas ref={digitalKnobCanvasRef} className={styles.canvas}
                        width={width} height={height}
                        onWheel={(evt) => {onWheelHandler(evt)}}>
                    </canvas>
                    <div className={styles.value}>{currentValue}</div>
                </div>
            </DigitalDisplayFrame>
        </div>
    );
}
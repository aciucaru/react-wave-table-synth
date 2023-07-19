import { useState } from "react";
import { useDispatch } from "react-redux";
import
{
    setCurrentEditedWaveformIndex,

    setCurrentWaveformStartShape,
    setCurrentWaveformEndShape,
} from "../../store/slices/wavetable-edit-slice";

import { ToggleButtonFrame } from "../decorations/ToggleButtonFrame";
import { WaveformShape } from "../../audio/basic-data/waveform-shape";

import { ILogObj, Logger } from "tslog";
import { WarnLogMsg } from "../../log/warn-log-messages";

import styles from "./WaveformSelector.module.css";

export enum SelectorDirection
{
    Horizontal = "Horizontal",
    Vertical = "Vertical"
}

export enum WaveformSide
{
    Start = "Start",
    End = "End"
}

export interface WaveformSelectorProp
{
    children?: any;
    direction?: SelectorDirection;
    label?: string;

    // the index of the SingleWaveform that this panel will be modifying
    editedWaveformIndex: number;
    editedSide: WaveformSide;
}

const mainLogger: Logger<ILogObj> = new Logger({ name: "WaveformSelector" });

export function WaveformSelector(props: WaveformSelectorProp): JSX.Element
{
    const [selectedWaveform, setSelectedWaveform] = useState(WaveformShape.SINE);

    const dispatch = useDispatch();

    const isSelected = (waveformType: WaveformShape) =>
    {
        if(waveformType != null)
        {
            if(selectedWaveform === waveformType)
                return true;
        }

        return false;
    };

    const getImageClass = (waveformType: WaveformShape) =>
    {
        let notSelectedClassName: string = styles.bgImage + " " + styles.sineImage;
        let selectedClassName: string = styles.bgImage + " " + styles.sineImageSelected;

        switch(waveformType)
        {
            case WaveformShape.SINE:
                notSelectedClassName = styles.bgImage + " " + styles.sineImage;
                selectedClassName = styles.bgImage + " " + styles.sineImageSelected;
                break;

            case WaveformShape.TRIANGLE:
                notSelectedClassName = styles.bgImage + " " + styles.triangleImage;
                selectedClassName = styles.bgImage + " " + styles.triangleImageSelected;
                break;

            case WaveformShape.SQUARE:
                notSelectedClassName = styles.bgImage + " " + styles.squareImage;
                selectedClassName = styles.bgImage + " " + styles.squareImageSelected;
                break;

            case WaveformShape.SAW:
                notSelectedClassName = styles.bgImage + " " + styles.sawImage;
                selectedClassName = styles.bgImage + " " + styles.sawImageSelected;
                break;
        }

        if(waveformType != null)
        {
            if(selectedWaveform === waveformType)
                return selectedClassName;
            else
                return notSelectedClassName;
        }

        return notSelectedClassName;
    };

    const getContainerClass = () =>
    {
        const horizontalClassName: string = styles.horizontalLayout;
        const verticalClassName: string = styles.verticalLayout;

        if(props.direction != null)
        {
            if(props.direction === SelectorDirection.Horizontal)
                return horizontalClassName;

            if(props.direction === SelectorDirection.Vertical)
                return verticalClassName;
        }

        return horizontalClassName;
    };

    const onSelectHandler = (waveformShape: WaveformShape) =>
    {
        mainLogger.debug(`onSelectHandler: waveform: ${waveformShape}`);

        setSelectedWaveform(waveformShape);

        if(waveformShape != null)
        {
            // 1. modify the currently edited waveform in the store
            dispatch(setCurrentEditedWaveformIndex(props.editedWaveformIndex));

            // 2. modify the 'start shape' of that waveform in the store
            if(props.editedSide === WaveformSide.Start)
                dispatch(setCurrentWaveformStartShape(waveformShape));

            if(props.editedSide === WaveformSide.End)
                dispatch(setCurrentWaveformEndShape(waveformShape));
        }
        else
            mainLogger.warn("onSelectHandler: " + WarnLogMsg.NULL_ARG + "waveformShape");
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.label}>{props.label}</div>
            <div className={styles.optionsContainer + " " + getContainerClass()}>
                <ToggleButtonFrame isSelected={isSelected(WaveformShape.SINE)}>
                    <div className={getImageClass(WaveformShape.SINE)}
                        onClick={(evt) => onSelectHandler(WaveformShape.SINE)}>
                    </div>
                </ToggleButtonFrame>

                <ToggleButtonFrame isSelected={isSelected(WaveformShape.TRIANGLE)}>
                    <div className={getImageClass(WaveformShape.TRIANGLE)}
                        onClick={(evt) => onSelectHandler(WaveformShape.TRIANGLE)}>
                    </div>
                </ToggleButtonFrame>

                <ToggleButtonFrame isSelected={isSelected(WaveformShape.SQUARE)}>
                    <div className={getImageClass(WaveformShape.SQUARE)}
                        onClick={(evt) => onSelectHandler(WaveformShape.SQUARE)}>
                    </div>
                </ToggleButtonFrame>

                <ToggleButtonFrame isSelected={isSelected(WaveformShape.SAW)}>
                    <div className={getImageClass(WaveformShape.SAW)}
                        onClick={(evt) => onSelectHandler(WaveformShape.SAW)}>
                    </div>
                </ToggleButtonFrame>
            </div>
        </div>
    );
}
import React from "react";
import { ILogObj, Logger } from "tslog";
import { InfoLogMsg } from "../../log/info-log-messages";

import styles from "./ToolbarButton.module.css";

export interface ToobarButtonProps
{
    width?: number;
    height?: number;
    icon?: string;
    children?: any;
    onClickHandler?: () => void;
}

const mainLogger: Logger<ILogObj> = new Logger({ name: "ToolbarButton" });

export function ToolbarButton(props: ToobarButtonProps): JSX.Element
{
    let btnWidth: number = props.width || 20;
    let btnHeight: number = props.height || 20;

    const onClickHandler = (event: React.MouseEvent<HTMLDivElement>) =>
    {
        mainLogger.info(InfoLogMsg.FUNCTION_START);
        
        if(props.onClickHandler != null)
            props.onClickHandler();
    };

    return (
        <div className={styles.mainContainer}
            style={{ width: btnWidth, height: btnHeight }}
            onClick={(evt) => {onClickHandler(evt)}}>
            <p className={styles.label}>{props.children}</p>
        </div>
    );
}
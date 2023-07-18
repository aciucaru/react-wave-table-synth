import { UI_SETTINGS } from "../ui-settings/ui-setting";

import styles from "./DigitalButtonFrame.module.css";

export interface DigitalButtonFrameProps
{
    children: any;
    hue?: number;
}


export function DigitalButtonFrame(props: DigitalButtonFrameProps): JSX.Element
{
    const hue: number = props.hue || UI_SETTINGS.digitalDisplayHue;
    const backgroundStyle =  `linear-gradient(135deg, rgb(60, 60, 60), rgb(20, 20, 20))`;
    
    return (
        <div className={styles.background}>
            {props.children}
        </div>
    );
}
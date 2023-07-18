import styles from "./DigitalDisplayFrame.module.css";

export interface DigitalDisplayFrameProps
{
    backgroundStyle?: string; // custom background style, if necessary
    children: any;
}

export function DigitalDisplayFrame(props: DigitalDisplayFrameProps): JSX.Element
{
    const backgroundStyle = `linear-gradient(135deg,
                                rgb(40, 40, 40),
                                rgb(25, 25, 25) 10%,
                                rgb(15, 15, 15) 30%,
                                rgb(10, 10, 10)
                                )`;

    return (
        <div className={styles.outerBorder}>
            <div className={styles.digitalDisplay}
                style={{background: backgroundStyle}}>
                {props.children}
            </div>
        </div>
    );
}
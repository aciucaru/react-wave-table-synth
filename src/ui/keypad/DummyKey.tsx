import styles from "./DummyKey.module.css";


export interface DummyKeyProps
{
    children?: any;
    className?: string;
}

export function DummyKey(props: DummyKeyProps): JSX.Element
{
    return (
        <div className={styles.outerFrame + " " + props.className}>
            {props.children}
        </div>
    );
}
import styles from "./ToggleButtonFrame.module.css";

export interface ToggleButtonFrameProps
{
    children: any;
    isSelected: boolean;
}

export function ToggleButtonFrame(props: ToggleButtonFrameProps): JSX.Element
{
    const getButtonBGClass = () =>
    {
        const notSelectedClassName = styles.background;
        const selectedClassName = styles.backgroundSelected;

        if(props.isSelected)
            return selectedClassName;
        else
            return notSelectedClassName;
    }
    
    return (
        <div className={getButtonBGClass()}>
            {props.children}
        </div>
    );
}
import { useDispatch } from "react-redux";
import { noteOn } from "../../store/slices/wavetable-synth-slice";

import { NoteData } from "../../audio/basic-data/note";

import { Logger, ILogObj } from "tslog";
import { InfoLogMsg } from "../../log/info-log-messages";
import { WarnLogMsg } from "../../log/warn-log-messages";

import styles from "./KeyButton.module.css";

export enum KeyType
{
    WHITE = "WHITE",
    BLACK = "BLACK"
}

export interface KeyButtonProps
{
    children?: any;
    keyType?: KeyType;
    className?: string;
    note: NoteData;
}

const mainLogger: Logger<ILogObj> = new Logger({ name: "KeyButton" });

export function KeyButton(props: KeyButtonProps): JSX.Element
{
    const dispatch = useDispatch();


    let keyTypeClass: string = "";

    if(props.keyType)
    {
        if(props.keyType === KeyType.WHITE)
        keyTypeClass = styles.whiteKey;

        if(props.keyType === KeyType.BLACK)
            keyTypeClass = styles.blackKey;
    }
    else
        keyTypeClass = styles.whiteKey; // default value


    const onClickHandler = (event: React.MouseEvent<HTMLButtonElement>) =>
    {
        mainLogger.info(InfoLogMsg.FUNCTION_START);

        if(props.note != null)
        {
            mainLogger.debug(`noteSemitone: ${props.note.semitone}`);
            dispatch(noteOn(props.note));
        }
        else
            mainLogger.warn(WarnLogMsg.ARG_NULL_INTERNAL_PROP);
    };

    return (
        <div className={styles.outerFrame + " " + props.className}>
            <button className={styles.innerFrame + " " + keyTypeClass}
                onClick={(evt) => {onClickHandler(evt)}}>
                {props.children}
            </button>
        </div>
    );
}
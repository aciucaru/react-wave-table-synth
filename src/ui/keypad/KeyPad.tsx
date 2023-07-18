import { notes } from "../../audio/service/audio-notes";
import { DummyKey } from "./DummyKey";
import { KeyButton, KeyType } from "./KeyButton";

import styles from "./KeyPad.module.css";
import { GlobalKeyInput } from "./GlobalKeyInput";

export interface KeyPadProps
{
    children?: any;
}

export function KeyPad(props: KeyPadProps): JSX.Element
{
    return (
        <div className={styles.mainContainer}>
            {/* first row: sharp notes */}
            <KeyButton note={notes.C3sharp} className={styles.C3sharp} keyType={KeyType.BLACK}>2</KeyButton>
            <KeyButton note={notes.D3sharp} className={styles.D3sharp} keyType={KeyType.BLACK}>3</KeyButton>

            <KeyButton note={notes.F3sharp} className={styles.F3sharp} keyType={KeyType.BLACK}>5</KeyButton>
            <KeyButton note={notes.G3sharp} className={styles.G3sharp} keyType={KeyType.BLACK}>6</KeyButton>
            <KeyButton note={notes.A3sharp} className={styles.A3sharp} keyType={KeyType.BLACK}>7</KeyButton>

            <KeyButton note={notes.C4sharp} className={styles.C4sharp} keyType={KeyType.BLACK}>9</KeyButton>
            <KeyButton note={notes.D4sharp} className={styles.D4sharp} keyType={KeyType.BLACK}>0</KeyButton>

            {/* second row: natural notes */}
            <KeyButton note={notes.C3} className={styles.C3} keyType={KeyType.WHITE}>Q</KeyButton>
            <KeyButton note={notes.D3} className={styles.D3} keyType={KeyType.WHITE}>W</KeyButton>
            <KeyButton note={notes.E3} className={styles.E3} keyType={KeyType.WHITE}>E</KeyButton>

            <KeyButton note={notes.F3} className={styles.F3} keyType={KeyType.WHITE}>R</KeyButton>
            <KeyButton note={notes.G3} className={styles.G3} keyType={KeyType.WHITE}>T</KeyButton>
            <KeyButton note={notes.A3} className={styles.A3} keyType={KeyType.WHITE}>Y</KeyButton>
            <KeyButton note={notes.B3} className={styles.B3} keyType={KeyType.WHITE}>U</KeyButton>

            <KeyButton note={notes.C4} className={styles.C4} keyType={KeyType.WHITE}>I</KeyButton>
            <KeyButton note={notes.D4} className={styles.D4} keyType={KeyType.WHITE}>O</KeyButton>
            <KeyButton note={notes.E4} className={styles.E4} keyType={KeyType.WHITE}>P</KeyButton>

            {/* third row: sharp notes */}
            <KeyButton note={notes.F4sharp} className={styles.F4sharp} keyType={KeyType.BLACK}>S</KeyButton>
            <KeyButton note={notes.G4sharp} className={styles.G4sharp} keyType={KeyType.BLACK}>D</KeyButton>
            <KeyButton note={notes.A4sharp} className={styles.A4sharp} keyType={KeyType.BLACK}>F</KeyButton>

            <KeyButton note={notes.C5sharp} className={styles.C5sharp} keyType={KeyType.BLACK}>H</KeyButton>
            <KeyButton note={notes.D5sharp} className={styles.D5sharp} keyType={KeyType.BLACK}>J</KeyButton>

            {/* forth row: natural notes */}
            <KeyButton note={notes.F4} className={styles.F4} keyType={KeyType.WHITE}>Z</KeyButton>
            <KeyButton note={notes.G4} className={styles.G4} keyType={KeyType.WHITE}>X</KeyButton>
            <KeyButton note={notes.A4} className={styles.A4} keyType={KeyType.WHITE}>C</KeyButton>
            <KeyButton note={notes.B4} className={styles.B4} keyType={KeyType.WHITE}>V</KeyButton>

            <KeyButton note={notes.C5} className={styles.C5} keyType={KeyType.WHITE}>B</KeyButton>
            <KeyButton note={notes.D5} className={styles.D5} keyType={KeyType.WHITE}>N</KeyButton>
            <KeyButton note={notes.E5} className={styles.E5} keyType={KeyType.WHITE}>M</KeyButton>



            {/* first row: dummy keys */}
            <DummyKey className={styles.keyTilde}>~</DummyKey>
            <DummyKey className={styles.key1}>1</DummyKey>
            <DummyKey className={styles.key4}>4</DummyKey>
            <DummyKey className={styles.key8}>8</DummyKey>
            <DummyKey className={styles.keyMinus}>-</DummyKey>
            <DummyKey className={styles.keyEquals}>=</DummyKey>
            <DummyKey className={styles.keyBackspace}>{"<-"}</DummyKey>

            {/* second row: dummy keys */}
            <DummyKey className={styles.keyTab}>Tab</DummyKey>
            <DummyKey className={styles.keySquareBracketOpened}>{"["}</DummyKey>
            <DummyKey className={styles.keySquareBracketClosed}>{"]"}</DummyKey>
            <DummyKey className={styles.keyEnter}>Enter</DummyKey>

            {/* third row: dummy keys */}
            <DummyKey className={styles.keyCapsLock}>Caps lock</DummyKey>
            <DummyKey className={styles.keyA}>A</DummyKey>
            <DummyKey className={styles.keyG}>G</DummyKey>
            <DummyKey className={styles.keyK}>K</DummyKey>
            <DummyKey className={styles.keyL}>L</DummyKey>
            <DummyKey className={styles.keyColon}>:</DummyKey>
            <DummyKey className={styles.keyQuoteMark}>"</DummyKey>
            <DummyKey className={styles.keyBackslash}>\</DummyKey>

            {/* fourth row: dummy keys */}
            <DummyKey className={styles.keyShift}>Shift</DummyKey>
            <DummyKey className={styles.keyLessThan}>{"<"}</DummyKey>
            <DummyKey className={styles.keyGreatherThan}>{">"}</DummyKey>
            <DummyKey className={styles.keyQuestionMark}>?</DummyKey>
            <DummyKey className={styles.keyShiftRight}>Shift</DummyKey>

            <div className={styles.globalKeyInput}>
                <GlobalKeyInput></GlobalKeyInput>
            </div>
        </div>
    );
}

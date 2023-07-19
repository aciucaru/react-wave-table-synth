import React from "react";
import { useDispatch } from "react-redux";
import { noteOn } from "../../store/slices/wavetable-synth-slice";

import { NoteData } from "../../audio/basic-data/note";
import { notes } from "../../audio/service/audio-notes";

export function GlobalKeyInput(): JSX.Element
{
    const dispatch = useDispatch();

    let note: NoteData | null = null;

    // const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {}

    const handleKeyDown = (event: KeyboardEvent) =>
    {
        console.log(event.key);
        switch(event.key)
        {
            // first row: sharp notes
            case "2": note = notes.C3sharp; break;
            case "3": note = notes.D3sharp; break;
            case "5": note = notes.F3sharp; break;
            case "6": note = notes.G3sharp; break;
            case "7": note = notes.A3sharp; break;

            case "9": note = notes.C4sharp; break;
            case "0": note = notes.D4sharp; break;

            // second row: natural notes
            case "q": case "Q": note = notes.C3; break;
            case "w": case "W": note = notes.D3; break;
            case "e": case "E": note = notes.E3; break;

            case "r": case "R": note = notes.F3; break;
            case "t": case "T": note = notes.G3; break;
            case "y": case "Y": note = notes.A3; break;
            case "u": case "U": note = notes.B3; break;

            case "i": case "I": note = notes.C4; break;
            case "o": case "O": note = notes.D4; break;
            case "p": case "P": note = notes.E4; break;

            // third row: sharp notes
            case "s": case "S": note = notes.F4sharp; break;
            case "d": case "D": note = notes.G4sharp; break;
            case "f": case "F": note = notes.A4sharp; break;

            case "h": case "H": note = notes.C5sharp; break;
            case "j": case "J": note = notes.D5sharp; break;

            // forth row: natural notes
            case "z": case "Z": note = notes.F4; break;
            case "x": case "X": note = notes.G4; break;
            case "c": case "C": note = notes.A4; break;
            case "v": case "V": note = notes.B4; break;

            case "b": case "B": note = notes.C5; break;
            case "n": case "N": note = notes.D5; break;
            case "m": case "M": note = notes.E5; break;

            default: note = null; break;
        }

        if(note)
            dispatch(noteOn(note));
    };

    const cleanup = () =>
    {
        document.removeEventListener('keydown', handleKeyDown);
    };

    React.useEffect( () =>
                        {
                            document.addEventListener('keydown', handleKeyDown);
                            return cleanup;
                        }
                    );

    return (
        <div></div>
    );
}
import { useCallback, useRef, useState } from 'react';
import { BoardContainer } from './styled';
import { Cell } from './Cell';
import { canSelectIndex } from './helpers';
import thinking from '../img/1F914.svg';
import submit from '../img/E10C.svg';
import writing from '../img/E263.svg';

type PropsT = {
    board: string[];
    pickedWords: string[];
    isDisabled?: boolean;
    onSelect: (word: string) => void;
    onSubmit: () => void;
};

export const Board = (props: PropsT) => {
    const [selected, setSelected] = useState<number[]>([]);
    const buttonRef = useRef<HTMLDivElement | null>(null);
    const selection = selected.map((i) => props.board[i]).join('');

    const onCellSelected = useCallback(
        (index: number) => {
            // No more than 2 words can be picked.
            if (props.pickedWords.length == 2) {
                return;
            }

            const currentIdx = selected.indexOf(index);

            if (!!~currentIdx) {
                if (currentIdx === 0) {
                    setSelected([]);
                    return;
                }

                // Only allow the user to deselect the last selected letter.
                if (currentIdx !== selected.length - 1) {
                    return;
                }

                const current = [ ...selected ];
                current.splice(currentIdx, 1);
                setSelected(current);

                return;
            }

            // Allow the user to pick whichever index as their first letter, but any
            // other pick should fall within the rules.
            if (
                selected.length > 0 &&
                !canSelectIndex(selected[selected.length - 1], index)
            ) {
                return;
            }

            setSelected([...selected, index]);
        },
        [selected, props.pickedWords],
    );

    const onSelectBtnClick = useCallback(() => {
        if (!~props.pickedWords.indexOf(selection)) {
            props.onSelect(selection);
            setSelected([]);
        } else if (!!buttonRef.current) {
            buttonRef.current.style.animation = 'error-shake 0.45s cubic-bezier(0.200, 0.480, 0.480, 0.980) both';

            setTimeout(() => {
                // @ts-ignore
                buttonRef.current.style.animation = undefined;
            }, 451);
        }
    }, [selected, selection, props.pickedWords]);

    let buttonContents = undefined;
    let buttonOnClick = () => {};

    if (!!props.isDisabled) {
        buttonContents = (
            <>
                <span>Already got'em!</span>
            </>
        );
    } else if (!!selection && props.pickedWords.length < 2) {
        buttonContents = (
            <>
                <span>{selection}</span>
                {selection.length >= 3 ? (
                    <img width="50" src={submit} />
                ) : (
                    <img width="50" src={writing} />
                )}
            </>
        );
        buttonOnClick = onSelectBtnClick;
    } else if (props.pickedWords.length === 2) {
        buttonContents = (
            <>
                <span>Check words</span>
            </>
        );
        buttonOnClick = props.onSubmit;
    } else {
        buttonContents = (
            <>
                <span>Pick a word</span>
                <img width="50" src={thinking} />
            </>
        );
    }

    return (
        <BoardContainer>
            <div className={`board${
                props.pickedWords.length === 2 || !!props.isDisabled ?
                    ' disabled' :
                    ''
            }`}>
                {props.board.map((letter, i) => {
                    return (
                        <Cell
                            value={letter}
                            index={i}
                            key={i}
                            selectedIndex={selected.indexOf(i)}
                            onCellSelected={onCellSelected}
                        />
                    );
                })}
            </div>
            <div className="selection">
                <div
                    className={`btn${
                        !!selection && selection.length >= 3 ? ' has-selection' : ''
                    }${
                        props.pickedWords.length === 2 && !props.isDisabled ? ' can-submit' : ''
                    }`}
                    onClick={buttonOnClick}
                    ref={buttonRef}
                >
                    {buttonContents}
                </div>
            </div>
        </BoardContainer>
    );
};

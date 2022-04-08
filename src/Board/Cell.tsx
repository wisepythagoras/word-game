import { useCallback, useRef } from 'react';

type PropsT = {
    value: string;
    index: number;
    selectedIndex: number;
    onCellSelected: (i: number) => void;
};

export const Cell = (props: PropsT) => {
    return (
        <div
            className={`cell ${!!~props.selectedIndex ? 'selected' : ''}`}
            id={props.index.toString()}
            onClick={() => props.onCellSelected(props.index)}
        >
            {!!~props.selectedIndex ? (
                <span className="index">
                    {props.selectedIndex + 1}
                </span>
            ) : undefined}
            <span>{props.value}</span>
        </div>
    );
};

type PropsT = {
    word: string;
    isDisabled?: boolean;
    onRemove: () => void;
};

export const Word = (props: PropsT) => {
    return (
        <div className="word">
            <span>{props.word}</span>
            {!props.isDisabled ? (
                <span onClick={props.onRemove}>&times;</span>
            ) : undefined}
        </div>
    );
};

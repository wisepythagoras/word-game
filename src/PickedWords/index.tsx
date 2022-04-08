import { Container } from './styled';
import { Word } from './Word';

type PropsT = {
    words: string[];
    isDisabled?: boolean;
    onRemove: (idx: number) => void;
};

export const PickedWords = (props: PropsT) => {
    return (
        <Container className="picked-words">
            <h2>Selections</h2>
            <ol>
                {props.words.map((word, i) => {
                    return (
                        <li>
                            <Word
                                word={word}
                                key={i}
                                onRemove={() => props.onRemove(i)}
                                isDisabled={props.isDisabled}
                            />
                        </li>
                    );
                })}
            </ol>
            {props.words.length === 0 ? (
                <div className="no-words">
                    No words yet.
                </div>
            ) : undefined}
        </Container>
    );
};

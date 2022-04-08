import dayjs from 'dayjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Board } from './Board';
import { usePickedWords } from './hooks/usePickedWords';
import { usePostWords } from './hooks/usePostWords';
import { Lives } from './Lives';
import { Modal } from './Modal';
import { PickedWords } from './PickedWords';
import { Title, Loading, Container } from './styled';

type APIRespT = {
    board: string[] | undefined;
    hint1: string | undefined;
    hint2: string | undefined;
};

type StateT = APIRespT & {
    showModal: boolean;
    closedModal: boolean;
    showErrorModal: boolean;
};

export default function App() {
    const [state, setState] = useState<StateT>({
        board: undefined,
        hint1: undefined,
        hint2: undefined,
        showModal: false,
        closedModal: false,
        showErrorModal: false,
    });
    const { pickedWords, setPickedWords } = usePickedWords();
    const { loading, found, tries, postWords } = usePostWords();
    const stateRef = useRef(state);
    const isDev = process.env.NODE_ENV === 'development';
    const lastTry = tries?.[tries.length - 1];

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    useEffect(() => {
        const triesLen = (tries || []).length;

        if (triesLen > 0 && triesLen < 5 && !found) {
            setState({
                ...stateRef.current,
                showErrorModal: true,
            });
        }
    }, [tries, found, state.board]);

    useEffect(() => {
        if (!stateRef.current.closedModal && !stateRef.current.showModal) {
            setState({
                ...stateRef.current,
                showModal: !!found,
            });
        }
    }, [found, state.board]);

    useEffect(() => {
        fetch(`${isDev ? 'http://127.0.0.1:8383' : ''}/get-puzzle`)
            .then(async (resp) => {
                setState({
                    ...stateRef.current,
                    ...await resp.json(),
                });
            });
    }, []);

    return (
        <Container>
            <br />
            {/* <Title>Word Game</Title> */}
            {!state.board ? (
                <Loading>Loading...</Loading>
            ) : (
                <>
                    <Lives lives={5 - (!!tries ? tries.length : 0) + (found ? 1 : 0)} />
                    <Board
                        board={state.board}
                        pickedWords={pickedWords}
                        onSelect={(word: string) => {
                            if (!!~pickedWords.indexOf(word)) {
                                return;
                            }

                            setPickedWords([...pickedWords, word]);
                        }}
                        isDisabled={found}
                        onSubmit={() => {
                            postWords(pickedWords);
                        }}
                    />
                </>
            )}
            <PickedWords
                words={pickedWords}
                isDisabled={found}
                onRemove={(idx) => {
                    const newPickedWords = [...pickedWords];
                    newPickedWords.splice(idx, 1);
                    setPickedWords(newPickedWords);
                }}
            />
            {state.hint1 || state.hint2 ? (
                <div className="hints">
                    <h2>Hints</h2>
                    <ol>
                        {!!state.hint1 ? (
                            <li>
                                <h3 className={lastTry?.word1 ? 'found' : ''}>
                                    {state.hint1}
                                </h3>
                            </li>
                        ) : undefined}
                        {!!state.hint2 ? (
                            <li>
                                <h3 className={lastTry?.word2 ? 'found' : ''}>
                                    {state.hint2}
                                </h3>
                            </li>
                        ) : undefined}
                    </ol>
                </div>
            ) : undefined}
            {state.showModal ? (
                 <Modal
                    title="You got it!"
                    onClose={() => {
                        setState({
                            ...state,
                            showModal: false,
                            closedModal: true,
                        });
                    }}
                >
                    <p>
                        Looks like you found today's words!
                    </p>
                    <p>
                        Come back tomorrow for the next game!
                    </p>
                </Modal>
            ) : undefined}
            {state.showErrorModal ? (
                <Modal
                    title="Uh, oh!"
                    onClose={() => {
                        setState({
                            ...state,
                            showErrorModal: false,
                        });
                    }}
                >
                    <p>You got it wrong this time. Try again!</p>
                    <p>
                        Word #1: <b>{lastTry?.word1 ? 'Found!' : 'Wrong :('}</b>
                    </p>
                    <p>
                        Word #2: <b>{lastTry?.word2 ? 'Found!' : 'Wrong :('}</b>
                    </p>
                </Modal>
            ) : undefined}
            {!!tries && tries?.length > 4 && !found ? (
                <Modal title=":(">
                    <p>You didn't win today, but try again tomorrow!</p>
                </Modal>
            ) : undefined}
            <div className="footer">
                <div>
                    &copy; wisepythagoras {dayjs().format('YYYY')}
                </div>
                <div>
                    The emoji images are adapted from{' '}
                    <a href="https://openmoji.org/about/" target="_blank">OpenEmoji</a>{' '}
                    (<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank">CC BY-SA 4.0</a> License).
                </div>
                <div>
                    Princeton University "About WordNet." <a href="https://wordnet.princeton.edu/" target="_blank">WordNet</a>. Princeton University. 2010. 
                </div>
            </div>
        </Container>
    );
}

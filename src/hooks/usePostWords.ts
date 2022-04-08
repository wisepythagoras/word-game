import { useState } from 'react';
import { useLocalStorage } from 'react-use';
import { getDateKey } from '../helpers';

type RespT = {
    word1: boolean;
    word2: boolean;
};

type StateT = {
    tries: RespT[];
    found: boolean;
};

/**
 * This custom hook handles the posting of picked words to the backend for
 * verification.
 * @returns The internal state and the function to perform the POST.
 */
export const usePostWords = () => {
    const [loading, setLoading] = useState(false);
    const isDev = process.env.NODE_ENV === 'development';
    const lsKey = `puzzle_${getDateKey(new Date())}`;
    const [state, setState, remove] = useLocalStorage<StateT>(lsKey, {
        tries: [],
        found: false,
    });

    const postWords = (words: string[]) => {
        setLoading(true);

        fetch(`${isDev ? 'http://127.0.0.1:8383' : ''}/check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(words),
        }).then(async (resp) => {
            const json = (await resp.json()) as RespT;

            setLoading(false);
            setState({
                tries: [...(state?.tries || []), json],
                found: json.word1 && json.word2,
            });
        });
    };

    // @ts-ignore
    window.__rmTr = remove;

    return {
        ...state,
        loading,
        postWords,
    }
};

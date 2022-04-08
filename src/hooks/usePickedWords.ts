import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';
import { useLocalStorage } from 'react-use';

/**
 * Handles the picked words in local storage.
 * @returns The picked words along with some utility functions.
 */
export const usePickedWords = () => {
    const [pickedWords, setPickedWordsInternal] = useState<string[]>([]);
    const [lsWords, setPickedWordsLS, removeWords] = useLocalStorage<string[]>('picked-words', []);
    const [date, setDate, removeDate] = useLocalStorage<Date>('picked-date');

    const setPickedWords = useCallback((words: string[]) => {
        if (!pickedWords || pickedWords.length === 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            setDate(today);
        }

        setPickedWordsLS(words);
    }, [pickedWords, date]);

    const clearStorage = useCallback(() => {
        removeWords();
        removeDate();
    }, [removeWords, removeDate]);

    useEffect(() => {
        setPickedWordsInternal(lsWords || []);
    }, [lsWords]);

    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        dayjs.extend(utc);
        dayjs.extend(tz);

        // If one day passes, then clear the storage, since we'll have a new puzzle for the user
        // to work on and try to solve.
        if (dayjs(today).tz('America/New_York').diff(date, 'day') >= 1) {
            clearStorage();
        }
    }, [date]);

    // @ts-ignore
    window.__clStrg = clearStorage;

    return {
        pickedWords,
        setPickedWords,
        removeWords,
    };
};

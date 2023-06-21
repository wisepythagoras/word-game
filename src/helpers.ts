import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';

/**
 * Returns a list of all possible indecies.
 * @param lastIndex The last picked index.
 * @param pickedIndex The index that the user picked.
 * @returns The list of all possible indecies.
 */
export const getPossibleIndecies = (lastIndex: number): number[] => {
    const row = Math.floor(lastIndex / 4);
    const column = lastIndex % 4;
    const possibleIndecies = [];

    // Down.
    if (row === 0 || row === 1 || row === 2) {
        possibleIndecies.push(lastIndex + 4);
    }

    // Up.
    if (row === 1 || row === 2 || row === 3) {
        possibleIndecies.push(lastIndex - 4);
    }

    // Right.
    if (column === 0 || column === 1 || column === 2) {
        possibleIndecies.push(lastIndex + 1);
    }

    // Left.
    if (column === 1 || column === 2 || column === 3) {
        possibleIndecies.push(lastIndex - 1);
    }

    // Down and right.
    if ((column === 0 || column === 1 || column === 2) && (row === 0 || row === 1 || row === 2)) {
        possibleIndecies.push(lastIndex + 5);
    }

    // Down and left.
    if ((column === 1 || column === 2 || column === 3) && (row === 0 || row === 1 || row === 2)) {
        possibleIndecies.push(lastIndex + 3);
    }

    // Up and left.
    if ((column === 1 || column === 2 || column === 3) && (row === 1 || row === 2 || row === 3)) {
        possibleIndecies.push(lastIndex - 5);
    }

    // Up and right.
    if ((column === 0 || column === 1 || column === 2) && (row === 1 || row === 2 || row === 3)) {
        possibleIndecies.push(lastIndex - 3);
    }

    return possibleIndecies;
};

/**
 * Creates a key of a date in string format.
 * @param date The date to get the key for.
 * @returns The key.
 */
export const getDateKey = (date: Date): string => {
    dayjs.extend(utc);
    dayjs.extend(tz);
    return dayjs(date).tz('America/New_York').format('DD_MM_YYYY');
}; 

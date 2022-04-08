import { getPossibleIndecies } from '../helpers';

/**
 * Checks if an index can be selected.
 * @param lastIndex The last picked index.
 * @param pickedIndex The currently picked index.
 */
export const canSelectIndex = (lastIndex: number, pickedIndex: number): boolean => {
    return !!~getPossibleIndecies(lastIndex).indexOf(pickedIndex);
};

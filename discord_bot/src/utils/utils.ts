/**
 * Return promise, that resolves after {ms} milliseconds.
 * @param ms - Sleep time in milliseconds
 */
export const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

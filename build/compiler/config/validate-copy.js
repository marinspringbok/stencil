import { unique } from '@utils';
export const validateCopy = (copy, defaultCopy = []) => {
    if (copy === null || copy === false) {
        return [];
    }
    if (!Array.isArray(copy)) {
        copy = [];
    }
    copy = copy.slice();
    for (const task of defaultCopy) {
        if (copy.every(t => t.src !== task.src)) {
            copy.push(task);
        }
    }
    return unique(copy, task => `${task.src}:${task.dest}:${task.keepDirStructure}`);
};

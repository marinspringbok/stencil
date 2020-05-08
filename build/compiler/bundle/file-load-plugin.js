import { normalizeFsPath } from '@utils';
export const fileLoadPlugin = (fs) => {
    return {
        name: 'fileLoadPlugin',
        load(id) {
            const fsFilePath = normalizeFsPath(id);
            return fs.readFile(fsFilePath);
        },
    };
};

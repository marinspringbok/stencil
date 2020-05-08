import { join, relative } from 'path';
export const getAbsoluteBuildDir = (outputTarget) => {
    const relativeBuildDir = relative(outputTarget.dir, outputTarget.buildDir);
    return join('/', relativeBuildDir) + '/';
};

import { getAbsolutePath } from '../config-utils';
import { isOutputTargetDistCollection } from '../../output-targets/output-utils';
import { join } from 'path';
import { normalizePath } from '@utils';
export const validateCollection = (config, userOutputs) => {
    return userOutputs.filter(isOutputTargetDistCollection).map(o => {
        return Object.assign(Object.assign({}, o), { dir: getAbsolutePath(config, o.dir || 'dist/collection') });
    });
};
export const getCollectionDistDir = (config) => {
    const collectionOutputTarget = config.outputTargets.find(isOutputTargetDistCollection);
    if (collectionOutputTarget) {
        return normalizePath(collectionOutputTarget.dir);
    }
    return normalizePath(join(config.rootDir, 'dist', 'collection'));
};

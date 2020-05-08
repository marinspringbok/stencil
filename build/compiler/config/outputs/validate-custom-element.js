import { getAbsolutePath } from '../config-utils';
import { isBoolean } from '@utils';
import { isOutputTargetDistCustomElements } from '../../output-targets/output-utils';
export const validateCustomElement = (config, userOutputs) => {
    return userOutputs.filter(isOutputTargetDistCustomElements).map(o => {
        const outputTarget = Object.assign(Object.assign({}, o), { dir: getAbsolutePath(config, o.dir || 'dist/components') });
        if (!isBoolean(outputTarget.empty)) {
            outputTarget.empty = true;
        }
        return outputTarget;
    });
};

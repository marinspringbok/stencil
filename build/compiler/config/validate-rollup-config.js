import { isObject, pluck } from '@utils';
export const validateRollupConfig = (config) => {
    const cleanRollupConfig = getCleanRollupConfig(config.rollupConfig);
    config.rollupConfig = cleanRollupConfig;
};
const getCleanRollupConfig = (rollupConfig) => {
    let cleanRollupConfig = DEFAULT_ROLLUP_CONFIG;
    if (!rollupConfig || !isObject(rollupConfig)) {
        return cleanRollupConfig;
    }
    if (rollupConfig.inputOptions && isObject(rollupConfig.inputOptions)) {
        cleanRollupConfig = Object.assign(Object.assign({}, cleanRollupConfig), { inputOptions: pluck(rollupConfig.inputOptions, ['context', 'moduleContext', 'treeshake']) });
    }
    if (rollupConfig.outputOptions && isObject(rollupConfig.outputOptions)) {
        cleanRollupConfig = Object.assign(Object.assign({}, cleanRollupConfig), { outputOptions: pluck(rollupConfig.outputOptions, ['globals']) });
    }
    return cleanRollupConfig;
};
const DEFAULT_ROLLUP_CONFIG = {
    inputOptions: {},
    outputOptions: {},
};

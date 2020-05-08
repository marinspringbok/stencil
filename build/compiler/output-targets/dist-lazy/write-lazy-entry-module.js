import { DEFAULT_STYLE_MODE } from '@utils';
import { join } from 'path';
export const writeLazyModule = async (config, compilerCtx, outputTargetType, destinations, entryModule, shouldHash, code, modeName, sufix) => {
    // code = replaceStylePlaceholders(entryModule.cmps, modeName, code);
    const bundleId = await getBundleId(config, entryModule.entryKey, shouldHash, code, modeName, sufix);
    const fileName = `${bundleId}.entry.js`;
    await Promise.all(destinations.map(dst => compilerCtx.fs.writeFile(join(dst, fileName), code, { outputTargetType })));
    return {
        bundleId,
        fileName,
        code,
        modeName,
    };
};
const getBundleId = async (config, entryKey, shouldHash, code, modeName, sufix) => {
    if (shouldHash) {
        const hash = await config.sys.generateContentHash(code, config.hashedFileNameLength);
        return `p-${hash}${sufix}`;
    }
    const components = entryKey.split('.');
    let bundleId = components[0];
    if (components.length > 2) {
        bundleId = `${bundleId}_${components.length - 1}`;
    }
    if (modeName !== DEFAULT_STYLE_MODE) {
        bundleId += '-' + modeName;
    }
    return bundleId + sufix;
};

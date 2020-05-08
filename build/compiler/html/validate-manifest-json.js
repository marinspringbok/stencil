import { buildError, buildJsonFileError } from '@utils';
import { dirname, join } from 'path';
import { isOutputTargetWww } from '../output-targets/output-utils';
export const validateManifestJson = (config, compilerCtx, buildCtx) => {
    if (config.devMode) {
        return null;
    }
    const outputTargets = config.outputTargets.filter(isOutputTargetWww);
    return Promise.all(outputTargets.map(async (outputsTarget) => {
        const manifestFilePath = join(outputsTarget.dir, 'manifest.json');
        try {
            const manifestContent = await compilerCtx.fs.readFile(manifestFilePath);
            if (manifestContent) {
                try {
                    const manifestData = JSON.parse(manifestContent);
                    await validateManifestJsonData(compilerCtx, buildCtx, manifestFilePath, manifestData);
                }
                catch (e) {
                    const err = buildError(buildCtx.diagnostics);
                    err.header = `Invalid manifest.json: ${e}`;
                    err.absFilePath = manifestFilePath;
                }
            }
        }
        catch (e) { }
    }));
};
const validateManifestJsonData = async (compilerCtx, buildCtx, manifestFilePath, manifestData) => {
    if (Array.isArray(manifestData.icons)) {
        await Promise.all(manifestData.icons.map((manifestIcon) => {
            return validateManifestJsonIcon(compilerCtx, buildCtx, manifestFilePath, manifestIcon);
        }));
    }
};
const validateManifestJsonIcon = async (compilerCtx, buildCtx, manifestFilePath, manifestIcon) => {
    let iconSrc = manifestIcon.src;
    if (typeof iconSrc !== 'string') {
        const msg = `Manifest icon missing "src"`;
        buildJsonFileError(compilerCtx, buildCtx.diagnostics, manifestFilePath, msg, `"icons"`);
        return;
    }
    if (iconSrc.startsWith('/')) {
        iconSrc = iconSrc.substr(1);
    }
    const manifestDir = dirname(manifestFilePath);
    const iconPath = join(manifestDir, iconSrc);
    const hasAccess = await compilerCtx.fs.access(iconPath);
    if (!hasAccess) {
        const msg = `Unable to find manifest icon "${manifestIcon.src}"`;
        buildJsonFileError(compilerCtx, buildCtx.diagnostics, manifestFilePath, msg, `"${manifestIcon.src}"`);
    }
};

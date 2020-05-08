import { validateBuildPackageJson } from '../types/validate-build-package-json';
import { validateManifestJson } from '../html/validate-manifest-json';
export const validateBuildFiles = (config, compilerCtx, buildCtx) => {
    if (buildCtx.hasError) {
        return null;
    }
    return Promise.all([validateBuildPackageJson(config, compilerCtx, buildCtx), validateManifestJson(config, compilerCtx, buildCtx)]);
};

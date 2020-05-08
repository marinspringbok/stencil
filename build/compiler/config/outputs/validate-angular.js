import { isOutputTargetAngular } from '../../output-targets/output-utils';
import { isAbsolute, join } from 'path';
export const validateAngular = (userConfig, userOutputs) => {
    const angularOutputTargets = userOutputs.filter(isOutputTargetAngular);
    return angularOutputTargets.map(outputTarget => {
        let directivesProxyFile = outputTarget.directivesProxyFile;
        if (directivesProxyFile && !isAbsolute(directivesProxyFile)) {
            directivesProxyFile = join(userConfig.rootDir, directivesProxyFile);
        }
        let directivesArrayFile = outputTarget.directivesArrayFile;
        if (directivesArrayFile && !isAbsolute(directivesArrayFile)) {
            directivesArrayFile = join(userConfig.rootDir, directivesArrayFile);
        }
        let directivesUtilsFile = outputTarget.directivesUtilsFile;
        if (directivesUtilsFile && !isAbsolute(directivesUtilsFile)) {
            directivesUtilsFile = join(userConfig.rootDir, directivesUtilsFile);
        }
        return {
            type: 'angular',
            componentCorePackage: outputTarget.componentCorePackage,
            directivesProxyFile,
            directivesArrayFile,
            directivesUtilsFile,
            excludeComponents: outputTarget.excludeComponents || []
        };
    });
};

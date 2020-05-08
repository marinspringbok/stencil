import { build } from './build';
import { BuildContext } from './build-ctx';
import { createTsBuildProgram } from '../transpile/create-build-program';
export const createFullBuild = async (config, compilerCtx) => {
    return new Promise(resolve => {
        let tsWatchProgram = null;
        compilerCtx.events.on('fileUpdate', p => {
            config.logger.debug(`fileUpdate: ${p}`);
            compilerCtx.fs.clearFileCache(p);
        });
        const onBuild = async (tsBuilder) => {
            const buildCtx = new BuildContext(config, compilerCtx);
            buildCtx.isRebuild = false;
            buildCtx.requiresFullBuild = true;
            buildCtx.start();
            const result = await build(config, compilerCtx, buildCtx, tsBuilder);
            if (result !== null) {
                if (tsWatchProgram) {
                    tsWatchProgram.close();
                    tsWatchProgram = null;
                }
                resolve(result);
            }
        };
        createTsBuildProgram(config, onBuild).then(program => {
            tsWatchProgram = program;
        });
    });
};

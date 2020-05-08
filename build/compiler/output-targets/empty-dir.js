import { isOutputTargetDist, isOutputTargetDistLazyLoader, isOutputTargetDistSelfContained, isOutputTargetHydrate, isOutputTargetWww, isOutputTargetDistCustomElements, isOutputTargetDistLazy, } from './output-utils';
import { isString } from '@utils';
import { join } from 'path';
const isEmptable = (o) => isOutputTargetDist(o) ||
    isOutputTargetDistCustomElements(o) ||
    isOutputTargetWww(o) ||
    isOutputTargetDistLazy(o) ||
    isOutputTargetDistLazyLoader(o) ||
    isOutputTargetDistSelfContained(o) ||
    isOutputTargetHydrate(o);
export const emptyOutputTargets = async (config, compilerCtx, buildCtx) => {
    if (buildCtx.isRebuild) {
        return;
    }
    const cleanDirs = config.outputTargets
        .filter(isEmptable)
        .filter(o => o.empty === true)
        .map(o => o.dir || o.esmDir)
        .filter(isString)
        .reduce((dirs, dir) => {
        if (!dirs.includes(dir)) {
            dirs.push(dir);
        }
        return dirs;
    }, []);
    if (cleanDirs.length === 0) {
        return;
    }
    const timeSpan = buildCtx.createTimeSpan(`cleaning ${cleanDirs.length} dirs`, true);
    await Promise.all(cleanDirs.map(dir => emptyDir(compilerCtx, buildCtx, dir)));
    timeSpan.finish('cleaning dirs finished');
};
const emptyDir = async (compilerCtx, buildCtx, dir) => {
    buildCtx.debug(`empty dir: ${dir}`);
    // Check if there is a .gitkeep file
    // We want to keep it so people don't have to readd manually
    // to their projects each time.
    const gitkeepPath = join(dir, '.gitkeep');
    const existsGitkeep = await compilerCtx.fs.access(gitkeepPath);
    await compilerCtx.fs.emptyDir(dir);
    // If there was a .gitkeep file, add it again.
    if (existsGitkeep) {
        await compilerCtx.fs.writeFile(gitkeepPath, '', { immediateWrite: true });
    }
};

import { getBuildFeatures, updateBuildConditionals } from '../../app-core/app-data';
export const getCustomElementsBuildConditionals = (config, cmps) => {
    const build = getBuildFeatures(cmps);
    build.lazyLoad = false;
    build.hydrateClientSide = false;
    build.hydrateServerSide = false;
    build.asyncQueue = config.taskQueue === 'congestionAsync';
    build.taskQueue = config.taskQueue !== 'immediate';
    updateBuildConditionals(config, build);
    build.devTools = false;
    return build;
};

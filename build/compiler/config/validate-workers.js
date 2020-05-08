export const validateWorkers = (config) => {
    if (typeof config.maxConcurrentWorkers !== 'number') {
        config.maxConcurrentWorkers = 8;
    }
    if (config.flags) {
        if (typeof config.flags.maxWorkers === 'number') {
            config.maxConcurrentWorkers = config.flags.maxWorkers;
        }
        else if (config.flags.ci) {
            config.maxConcurrentWorkers = 4;
        }
    }
    config.maxConcurrentWorkers = Math.max(Math.min(config.maxConcurrentWorkers, 16), 0);
};

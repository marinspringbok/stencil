import { convertValueToLiteral, createStaticGetter } from './transform-utils';
export const addWatchers = (classMembers, cmp) => {
    if (cmp.watchers.length > 0) {
        const watcherObj = {};
        cmp.watchers.forEach(({ propName, methodName }) => {
            watcherObj[propName] = watcherObj[propName] || [];
            watcherObj[propName].push(methodName);
        });
        classMembers.push(createStaticGetter('watchers', convertValueToLiteral(watcherObj)));
    }
};

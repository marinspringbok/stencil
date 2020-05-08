import { getAbsoluteBuildDir } from './html-utils';
import { join } from 'path';
export const optimizeCriticalPath = (doc, criticalBundlers, outputTarget) => {
    const buildDir = getAbsoluteBuildDir(outputTarget);
    const paths = criticalBundlers.map(path => join(buildDir, path));
    injectModulePreloads(doc, paths);
};
export const injectModulePreloads = (doc, paths) => {
    const existingLinks = Array.from(doc.querySelectorAll('link[rel=modulepreload]')).map(link => link.getAttribute('href'));
    const addLinks = paths.filter(path => !existingLinks.includes(path)).map(path => createModulePreload(doc, path));
    const firstScript = doc.head.querySelector('script');
    if (firstScript) {
        addLinks.forEach(link => {
            doc.head.insertBefore(link, firstScript);
        });
    }
    else {
        addLinks.forEach(link => {
            doc.head.appendChild(link);
        });
    }
};
const createModulePreload = (doc, href) => {
    const link = doc.createElement('link');
    link.setAttribute('rel', 'modulepreload');
    link.setAttribute('href', href);
    return link;
};

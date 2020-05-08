import { basename } from 'path';
import { unique } from '@utils';
export const filesChanged = (buildCtx) => {
    // files changed include updated, added and deleted
    return unique([...buildCtx.filesUpdated, ...buildCtx.filesAdded, ...buildCtx.filesDeleted]).sort();
};
export const scriptsAdded = (buildCtx) => {
    // collect all the scripts that were added
    return buildCtx.filesAdded
        .filter(f => {
        return SCRIPT_EXT.some(ext => f.endsWith(ext.toLowerCase()));
    })
        .map(f => basename(f));
};
export const scriptsDeleted = (buildCtx) => {
    // collect all the scripts that were deleted
    return buildCtx.filesDeleted
        .filter(f => {
        return SCRIPT_EXT.some(ext => f.endsWith(ext.toLowerCase()));
    })
        .map(f => basename(f));
};
export const hasScriptChanges = (buildCtx) => {
    return buildCtx.filesChanged.some(f => {
        const ext = getExt(f);
        return SCRIPT_EXT.includes(ext);
    });
};
export const hasStyleChanges = (buildCtx) => {
    return buildCtx.filesChanged.some(f => {
        const ext = getExt(f);
        return STYLE_EXT.includes(ext);
    });
};
const getExt = (filePath) => filePath
    .split('.')
    .pop()
    .toLowerCase();
const SCRIPT_EXT = ['ts', 'tsx', 'js', 'jsx'];
export const isScriptExt = (ext) => SCRIPT_EXT.includes(ext);
const STYLE_EXT = ['css', 'scss', 'sass', 'pcss', 'styl', 'stylus', 'less'];
export const isStyleExt = (ext) => STYLE_EXT.includes(ext);
export const hasHtmlChanges = (config, buildCtx) => {
    const anyHtmlChanged = buildCtx.filesChanged.some(f => f.toLowerCase().endsWith('.html'));
    if (anyHtmlChanged) {
        // any *.html in any directory that changes counts and rebuilds
        return true;
    }
    const srcIndexHtmlChanged = buildCtx.filesChanged.some(fileChanged => {
        // the src index index.html file has changed
        // this file name could be something other than index.html
        return fileChanged === config.srcIndexHtml;
    });
    return srcIndexHtmlChanged;
};
export const updateCacheFromRebuild = (compilerCtx, buildCtx) => {
    buildCtx.filesChanged.forEach(filePath => {
        compilerCtx.fs.clearFileCache(filePath);
    });
    buildCtx.dirsAdded.forEach(dirAdded => {
        compilerCtx.fs.clearDirCache(dirAdded);
    });
    buildCtx.dirsDeleted.forEach(dirDeleted => {
        compilerCtx.fs.clearDirCache(dirDeleted);
    });
};

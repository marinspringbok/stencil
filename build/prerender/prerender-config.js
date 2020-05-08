import { buildError, catchError, requireFunc } from '@utils';
import fs from 'fs';
export function getPrerenderConfig(diagnostics, prerenderConfigPath) {
    const prerenderConfig = {};
    if (typeof prerenderConfigPath === 'string') {
        try {
            const userConfig = requireFunc(prerenderConfigPath);
            if (userConfig != null) {
                Object.assign(prerenderConfig, userConfig);
            }
        }
        catch (e) {
            catchError(diagnostics, e);
        }
    }
    if (typeof prerenderConfig.crawlUrls !== 'boolean') {
        prerenderConfig.crawlUrls = true;
    }
    if (typeof prerenderConfig.trailingSlash !== 'boolean') {
        prerenderConfig.trailingSlash = false;
    }
    return prerenderConfig;
}
export function validatePrerenderConfigPath(diagnostics, prerenderConfigPath) {
    if (typeof prerenderConfigPath === 'string') {
        const hasAccess = fs.existsSync(prerenderConfigPath);
        if (!hasAccess) {
            const err = buildError(diagnostics);
            err.header = `Prerender Config Not Found`;
            err.messageText = `Unable to access: ${prerenderConfigPath}`;
        }
        else {
            try {
                const userConfig = requireFunc(prerenderConfigPath);
                if (!userConfig) {
                    const err = buildError(diagnostics);
                    err.header = `Invalid Prerender Config`;
                    err.messageText = `Invalid prerender config: ${prerenderConfigPath}`;
                }
            }
            catch (e) {
                catchError(diagnostics, e);
            }
        }
    }
}
export function getHydrateOptions(prerenderConfig, url, diagnostics) {
    const prerenderUrl = url.href;
    const opts = {
        url: prerenderUrl,
        addModulePreloads: true,
        approximateLineWidth: 100,
        inlineExternalStyleSheets: true,
        minifyScriptElements: true,
        minifyStyleElements: true,
        removeAttributeQuotes: true,
        removeBooleanAttributeQuotes: true,
        removeEmptyAttributes: true,
        removeHtmlComments: true,
    };
    if (prerenderConfig.canonicalUrl === null || prerenderConfig.canonicalUrl === false) {
        opts.canonicalUrl = null;
    }
    else if (typeof prerenderConfig.canonicalUrl === 'function') {
        try {
            opts.canonicalUrl = prerenderConfig.canonicalUrl(url);
        }
        catch (e) {
            catchError(diagnostics, e);
        }
    }
    else {
        opts.canonicalUrl = prerenderUrl;
    }
    if (typeof prerenderConfig.hydrateOptions === 'function') {
        try {
            const userOpts = prerenderConfig.hydrateOptions(url);
            if (userOpts != null) {
                if (userOpts.prettyHtml && typeof userOpts.removeAttributeQuotes !== 'boolean') {
                    opts.removeAttributeQuotes = false;
                }
                Object.assign(opts, userOpts);
            }
        }
        catch (e) {
            catchError(diagnostics, e);
        }
    }
    return opts;
}

import { renderCatchError, renderBuildDiagnostic } from './render-utils';
export function runtimeLogging(win, opts, results) {
    try {
        const pathname = win.location.pathname;
        win.console.error = (...msgs) => {
            renderCatchError(results, [...msgs].join(', '));
            if (opts.runtimeLogging) {
                runtimeLog(pathname, 'error', msgs);
            }
        };
        win.console.debug = (...msgs) => {
            renderBuildDiagnostic(results, 'debug', 'Hydrate Debug', [...msgs].join(', '));
            if (opts.runtimeLogging) {
                runtimeLog(pathname, 'debug', msgs);
            }
        };
        if (opts.runtimeLogging) {
            ['log', 'warn', 'assert', 'info', 'trace'].forEach(type => {
                win.console[type] = (...msgs) => {
                    runtimeLog(pathname, type, msgs);
                };
            });
        }
    }
    catch (e) {
        renderCatchError(results, e);
    }
}
function runtimeLog(pathname, type, msgs) {
    global.console[type].apply(global.console, [`[ ${pathname}  ${type} ] `, ...msgs]);
}

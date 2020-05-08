import { BUILD } from '@app-data';
import { consoleDevWarn, win } from '@platform';
import { getElement } from './element';
export const createEvent = (ref, name, flags) => {
    const elm = getElement(ref);
    return {
        emit: (detail) => {
            if (BUILD.isDev && !elm.isConnected) {
                consoleDevWarn(`The "${name}" event was emitted, but the dispatcher node is no longer connected to the dom.`);
            }
            return emitEvent(elm, name, {
                bubbles: !!(flags & 4 /* Bubbles */),
                composed: !!(flags & 2 /* Composed */),
                cancelable: !!(flags & 1 /* Cancellable */),
                detail,
            });
        },
    };
};
export const emitEvent = (elm, name, opts) => {
    const ev = new (BUILD.hydrateServerSide ? win.CustomEvent : CustomEvent)(name, opts);
    elm.dispatchEvent(ev);
    return ev;
};

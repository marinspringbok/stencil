export const applyPolyfills = (win) => {
    applyCustomEvent(win);
};
const applyCustomEvent = (win) => {
    if (typeof win.CustomEvent === 'function') {
        return;
    }
    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        const evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }
    CustomEvent.prototype = win.Event.prototype;
    win.CustomEvent = CustomEvent;
};

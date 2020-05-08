import { caughtErrors } from './testing-constants';
export const consoleError = (e) => {
    caughtErrors.push(e);
};
export const consoleDevError = (...e) => {
    caughtErrors.push(new Error(e.join(', ')));
};
export const consoleDevWarn = (..._) => {
    /* noop for testing */
};
export const consoleDevInfo = (..._) => {
    /* noop for testing */
};

export const GLOBAL_SCOPE = ':root';
export function findRegex(regex, cssText, offset) {
    regex['lastIndex'] = 0;
    const r = cssText.substring(offset).match(regex);
    if (r) {
        const start = offset + r['index'];
        return {
            start,
            end: start + r[0].length,
        };
    }
    return null;
}

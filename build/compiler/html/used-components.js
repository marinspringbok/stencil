export const getUsedComponents = (doc, cmps) => {
    const tags = new Set(cmps.map(cmp => cmp.tagName.toUpperCase()));
    const found = [];
    const searchComponents = (el) => {
        if (tags.has(el.tagName)) {
            found.push(el.tagName.toLowerCase());
        }
        for (let i = 0; i < el.childElementCount; i++) {
            searchComponents(el.children[i]);
        }
    };
    searchComponents(doc.documentElement);
    return found;
};

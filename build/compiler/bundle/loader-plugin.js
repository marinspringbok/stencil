export const loaderPlugin = (entries = {}) => {
    return {
        name: 'stencilLoaderPlugin',
        resolveId(id) {
            if (id in entries) {
                return {
                    id,
                };
            }
            return null;
        },
        load(id) {
            if (id in entries) {
                return entries[id];
            }
            return null;
        },
    };
};

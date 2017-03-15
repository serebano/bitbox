export default (target, ...args) => {
    function merge(state, ...args) {
        return Object.assign(state, ...args);
    }

    return context => context.select(target).apply(merge, ...args);
};

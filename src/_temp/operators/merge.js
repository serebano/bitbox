export default (target, ...args) => {
    return function merge(context) {
        context.select(target).apply(
            function merge(state, ...args) {
                return Object.assign(state, ...args);
            },
            ...args
        );
    };
};

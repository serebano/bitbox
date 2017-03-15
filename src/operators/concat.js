export default (target, ...args) => {
    return context => context.select(target).apply(
        function concat(array = [], ...args) {
            return array.concat(args);
        },
        ...args
    );
};

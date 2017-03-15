export default (target, ...args) => {
    function concat(array = [], ...args) {
        return array.concat(args);
    }

    return context => context.select(target).apply(concat, ...args);
};

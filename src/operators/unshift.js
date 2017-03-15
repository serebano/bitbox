export default (target, ...args) => {
    function unshift(array = [], ...values) {
        array.unshift(...values);

        return array;
    }

    return context => context.select(target).apply(unshift, ...args);
};

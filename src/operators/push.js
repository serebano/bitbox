export default (target, ...args) => {
    function push(array = [], ...values) {
        array.push(...values);

        return array;
    }

    return context => context.select(target).apply(push, ...args);
};

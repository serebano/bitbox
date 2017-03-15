export default (target, ...args) => {
    return function push(context) {
        context.select(target).apply(
            function push(array = [], ...values) {
                array.push(...values);

                return array;
            },
            ...args
        );
    };
};

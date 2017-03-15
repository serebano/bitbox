export default (target, ...args) => {
    return function unshift(context) {
        context.select(target).apply(
            function unshift(array = [], ...values) {
                array.unshift(...values);

                return array;
            },
            ...args
        );
    };
};

export default target => {
    return function pop(context) {
        context.select(target).apply(function pop(array) {
            array.pop();

            return array;
        });
    };
};

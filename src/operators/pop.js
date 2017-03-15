export default target => {
    return context => {
        context.select(target).apply(function pop(array) {
            array.pop();
            return array;
        });
    };
};

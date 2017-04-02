export default path => {
    return function pop(context) {
        path(context, function pop(array) {
            array.pop();

            return array;
        });
    };
};

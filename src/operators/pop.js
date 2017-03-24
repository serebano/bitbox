export default path => {
    return function pop(context) {
        path.set(context, function pop(array) {
            array.pop();

            return array;
        });
    };
};

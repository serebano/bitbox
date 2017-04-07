export default (path, ...args) => {
    return function unshift(context) {
        path(context, (array = []) => {
            array.unshift(...args);

            return array;
        });
    };
};

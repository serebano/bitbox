export default (path, ...args) => {
    return function unshift(context) {
        path.set(context, ...args, (array = [], ...args) => {
            array.unshift(...args);

            return array;
        });
    };
};

function unshift(target, path, ...args) {
    return path.set(target, ...args, (array = [], ...args) => {
        array.unshift(...args);

        return array;
    });
}

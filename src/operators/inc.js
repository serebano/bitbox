export default (path, arg) => {
    return function inc(context) {
        path(context, (num = 0) => num + 1);
    };
};

export default (path, ...args) => {
    return function get(context) {
        return path.get(context, ...args);
    };
};

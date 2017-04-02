export default (path, ...args) => {
    return function push(context) {
        path(context, (target = []) => {
            target.push(...args);

            return target;
        });
    };
};

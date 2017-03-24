export default (path, ...args) => {
    return function push(context) {
        path.set(context, ...args, (target = [], ...args) => {
            target.push(...args);

            return target;
        });
    };
};

export function keys(path) {
    return this.get(path, Object.keys);
}

export function values(path) {
    return this.get(path, Object.values);
}

export function push(path, ...args) {
    return this.apply(
        path,
        function push(array = [], ...args) {
            array.push(...args);

            return array;
        },
        ...args
    );
}

export function unshift(path, ...args) {
    return this.apply(
        path,
        function unshift(array = [], ...args) {
            array.unshift(...args);

            return array;
        },
        ...args
    );
}

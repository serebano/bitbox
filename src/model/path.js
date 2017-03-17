export default {
    reduce(path, func, target) {
        return this.keys(path).reduce(func, target);
    },
    join(...path) {
        return path.reduce(
            (keys, key, index, path) => {
                if (!key || key === "") return keys;
                return keys.concat(this.keys(key));
            },
            []
        );
    },
    resolve(...path) {
        return path.reduce(
            (keys, key, index, path) => {
                if (typeof key === "function") return key(keys, index, path);
                return keys.concat(this.keys(key));
            },
            []
        );
    },
    toString(path) {
        return path.join(".");
    },
    toArray(path = []) {
        if (Array.isArray(path)) {
            return path;
        } else if (typeof path === "string") {
            return path === "." || path === "" ? [] : path.split(".");
        } else if (typeof path === "number") {
            return [String(path)];
        }

        return [];
    },
    keys(path = []) {
        if (Array.isArray(path)) {
            return path;
        } else if (typeof path === "string") {
            return path === "." || path === "" ? [] : path.split(".");
        } else if (typeof path === "number") {
            return [String(path)];
        }

        return [];
    },
    apply(path, trap, target, ...args) {
        return this.keys(path).reduce(
            (target, key, index, keys) => {
                if (index === keys.length - 1) return trap(target, key, ...args);

                return target[key];
            },
            target
        );
    }
};

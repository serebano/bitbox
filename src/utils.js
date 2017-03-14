export function delay(func, wait) {
    return function(...args) {
        const context = this;
        const later = () => {
            func.apply(context, args);
        };

        setTimeout(later, wait);
    };
}

export function getChangedProps(propsA, propsB) {
    const propsAKeys = Object.keys(propsA);
    const propsBKeys = Object.keys(propsB);
    const changedProps = [];

    for (let i = 0; i < propsAKeys.length; i++) {
        if (propsA[propsAKeys[i]] !== propsB[propsAKeys[i]]) {
            changedProps.push({
                path: [propsAKeys[i]]
            });
        }
    }

    for (let i = 0; i < propsBKeys.length; i++) {
        if (propsA[propsBKeys[i]] !== propsB[propsBKeys[i]]) {
            changedProps.push({
                path: [propsBKeys[i]]
            });
        }
    }

    return changedProps;
}

export function Context(providers, ...args) {
    if (!(this instanceof Context)) return new Context(...arguments);

    return providers.reduce((context, Provider) => Provider(context, ...args), this);
}

export function ensureStrictPath(path, value) {
    if (isComplexObject(value) && path.indexOf("*") === -1) {
        return `${path}.**`;
    }

    return path;
}

export function absolutePath(target, context) {
    return target.type + "." + target.path(context);
}

export function extractFrom(target, path) {
    if (!target) throw new Error(`Invalid target, extracting with path: ${path}`);

    const keys = !Array.isArray(path) ? path.split(".") : path;

    return keys.reduce(
        (result, key, index) => {
            if (index > 0 && result === undefined) {
                console.log(`target`, target, key, index, result);
                throw new Error(
                    `A tag is extracting with path "${path}/${key}[${index}]", but it is not valid`
                );
            }
            return key === "" || key === "*" || key === "**" ? result : result[key];
        },
        target
    );
}

export function ensurePath(path = []) {
    if (Array.isArray(path)) {
        return path;
    } else if (typeof path === "string") {
        return path === "." || path === "" ? [] : path.split(".");
    }

    return [];
}

export function isValidResult(result) {
    return !result || (typeof result === "object" && !Array.isArray(result));
}

export function isPromise(result) {
    return result && typeof result.then === "function" && typeof result.catch === "function";
}

export function cleanPath(path) {
    return path.indexOf("*") > -1 ? path.replace(/\.\*\*|\.\*/, "") : path;
}

export function isObject(obj) {
    return typeof obj === "object" && obj !== null && !Array.isArray(obj);
}

export function isComplexObject(obj) {
    return typeof obj === "object" && obj !== null;
}

import bit from "./bit";
import run from "./run";
import is from "./utils/is";

export const props = bit(bit.props);
export const state = bit(bit.state);

export const signal = bit(bit.signals, function(resolve) {
    return function signal(path, target, tree) {
        if (arguments.length === 3) {
            return resolve(path, target, () => {
                const signal = props => run(signal.displayName, signal.tree, props);
                signal.displayName = path.join(".");
                signal.tree = [].concat(tree);

                return signal;
            });
        }

        return resolve(path, target);
    };
});

export const github = bit(function github(path, target, p) {
    const parts = path.slice();
    const url = `https://api.github.com/${parts.join("/")}`;
    return new Promise(resolve => {
        setTimeout(
            () => resolve({
                endpoint: url,
                repo: parts.pop(),
                user: parts.pop()
            }),
            2000
        );
    }).then(result => {
        if (target && p) p.$resolve(p.$path.concat(path), target, result);
        return { result };
    });
});

export const one = bit(function One(path, target) {
    one.target = bit(target);

    function one(path, target, value) {
        let isSet = arguments.length === 3;
        const obj = isSet && !is.path(target)
            ? bit.$resolve(path, one.target, value)
            : bit.$resolve(path, one.target);

        if (is.path(target))
            return isSet
                ? target.$resolve(target.$path, obj, value)
                : target.$resolve(target.$path, obj);

        if (is.function(target)) {
            const args = [...arguments].slice(1);
            path.push(...args);

            return path;
        }

        return obj;
    }

    return bit(one, path);
});

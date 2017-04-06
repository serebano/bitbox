import bit from "./bit";
import run from "./run";
import is from "./utils/is";
import Path from "./path";

export const props = bit.props.$extend(
    resolve => function props() {
        return resolve(...arguments);
    }
);

export const state = bit.state.$extend(
    resolve => function state() {
        return resolve(...arguments);
    }
);

export const signal = bit.signals.$extend(
    resolve => function signal(path) {
        // if (arguments.length === 3) {
        //     return resolve(path, target, () => props => run(path.join("."), tree, props));
        // }

        return resolve(...arguments);
    }
);

export const github = bit.$extend(
    resolve => function Github(path, target, setter) {
        if (is.function(target)) return Path(Github, path.concat([...arguments].slice(1)));

        return fetch(path).then(result => {
            if (target) {
                const value = resolve(path.slice(3), result);
                setter = setter || (value => value);

                return resolve(path, target, s => setter(value));
            }

            return resolve(path.slice(3), result);
        });
    }
);

function fetch(path) {
    const parts = path.slice();
    const url = `https://api.github.com/${parts.slice(0, 3).join("/")}`;
    return window.fetch(url).then(result => result.json());
}

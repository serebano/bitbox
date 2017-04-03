import bit from "./bit";
import run from "./run";
import is from "./utils/is";

export const props = bit(bit.props);
export const state = bit(bit.state);

export const signal = bit(bit.signals, function(reducer) {
    return function signal(path, target, tree) {
        if (arguments.length === 3) {
            return reducer(path, target, () => {
                const signal = props => run(signal.displayName, signal.tree, props);
                signal.displayName = path.join(".");
                signal.tree = [].concat(tree);

                return signal;
            });
        }

        return reducer(path, target);
    };
});

export const github = bit(
    bit,
    reducer => function github(path, target, p) {
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
    }
);

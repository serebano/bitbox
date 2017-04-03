import bit from "./bit";
import run from "./run";
import is from "./utils/is";
import Path from "./path";

export const props = new bit.props();
export const state = new bit.state();

export const signal = new bit.signals(resolve => {
    return function Signal(path, target, tree) {
        if (arguments.length === 3) {
            return resolve(path, target, () => props => run(path.join("."), tree, props));
        }

        return resolve(path, target);
    };
});

export const github = new bit(resolve => {
    return function Github(path, target, setter) {
        if (is.function(target)) return Path(Github, path.concat([...arguments].slice(1)));

        return fetch(path).then(result => {
            if (target) {
                const value = resolve(path.slice(3), result);
                setter = setter || (value => value);

                return resolve(path, target, s => setter(value));
            }

            return resolve(path.slice(3), result);
        });
    };
});

function fetch(path) {
    const parts = path.slice();
    const url = `https://api.github.com/${parts.slice(0, 3).join("/")}`;
    console.log(`fetch`, url);
    // parts.shift();
    // return new Promise(resolve => {
    //     setTimeout(
    //         () => resolve({
    //             endpoint: url,
    //             repo: parts.shift(),
    //             user: parts.shift(),
    //             owner: {
    //                 id: Date.now()
    //             }
    //         }),
    //         200
    //     );
    // }).then(result => result);
    return window.fetch(url).then(result => result.json());
}

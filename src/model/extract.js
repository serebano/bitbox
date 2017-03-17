import Path from "./path";

function extract(target, path, view, ...args) {
    const keys = Path.keys(path);
    const last = keys[keys.length - 1];
    if (last === "*" || last === "**") keys.pop();

    return keys.reduce(
        (target, key, index) => {
            if (index === keys.length - 1) {
                return view ? view(target, key, ...args) : { value: target[key], key, index };
            } else if (!target[key]) {
                throw new Error(
                    `The path "${path}" is invalid. Does the path "${keys
                        .splice(0, keys.length - 1)
                        .join(".")}" exist?`
                );
            }

            return target[key];
        },
        target
    );
}

export default extract;

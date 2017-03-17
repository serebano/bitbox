import Path from "../Path";

function Changes(changes = []) {
    if (changes instanceof Changes) return changes;

    changes.__proto__ = Changes.prototype;

    return changes;
}

Changes.prototype = [];
Changes.prototype.last = function last() {
    return this[this.length - 1];
};
Changes.prototype.flush = function flush() {
    return this.splice(0, this.length);
};
Changes.prototype.push = function push(path, method, args, options = {}) {
    path = Path.toArray(path);
    const [type, ...keys] = path;
    const desc = {
        type: type,
        keys: keys,
        path: path,
        args: args,
        method: method,
        forceChildPathUpdates: options.force
    };

    desc.index = Array.prototype.push.call(this, desc);
    debug(desc);

    return desc;
};

function debug(e) {
    const index = e.index;
    const type = e.type;
    const typeKeys = type ? type.split(".") : [];
    const args = ["%c'" + (e.keys.join(".") || "") + "'%c"]
        .concat(e.args)
        .map(arg => {
            if (typeof arg === "function")
                return "function " + (arg.displayName || arg.name) || String(arg);
            if (typeof arg === "object") return JSON.stringify(arg);
            return String(arg);
        })
        .join(", ");

    if (index === 1) console.log(`***`);
    console.log(
        `[${index}] %c${type}%c.%c${e.method}%c(${args}%c)`,
        `color:#e5c07b`,
        `color:#abb2bf`,
        `color:#61afef`,
        `color:#abb2bf`,
        `color:#98c379`,
        `color:#5c6370`,
        "color:#abb2bf"
    );
}

export default Changes;

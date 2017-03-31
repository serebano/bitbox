import compute from "../compute";
import is from "../is";
import wellKnowSymbols from "../observer/wellKnownSymbols";

export const isPath = Symbol("isPath");
export const toPrimitive = () => "";

let objTransfer = null;

function Path(resolve, root = [], isRoot = true) {
    function $(...args) {
        objTransfer = undefined;
        return resolve.call($, $.path, ...args);
    }

    $[isPath] = true;
    $.root = root;
    $.isRoot = isRoot;
    $.path = objTransfer ? $.root.concat(objTransfer) : $.root.slice();
    $[Symbol.isConcatSpreadable] = false;
    $.toString = () => toString($.path.slice());

    const proxy = new Proxy($, {
        get(target, key, receiver) {
            if (key === "$") return Path(resolve, $.path.slice(), true);
            if (key === Symbol.toPrimitive) {
                objTransfer = proxy;
                return toPrimitive;
            }
            if (typeof key === "symbol" && wellKnowSymbols.has(key))
                return Reflect.get(target, key, receiver);

            if (key === "path" || key === "root" || key === isPath)
                return Reflect.get(target, key, receiver);

            const step = objTransfer || key;
            objTransfer = undefined;

            if ($.isRoot) return Path(resolve, $.path.concat(step), false);

            $.path.push(step);

            return proxy;
        },
        has(target, key) {
            return true;
        }
    });

    return proxy;
}

function toString(path) {
    if (!path.length) return `$`;
    if (path.length === 1) return is.path(path[0]) ? `${path[0].toString()}` : String(path[0]);
    return `${path.map((p, i) => is.path(p) ? `[${p.toString()}]` : i > 0 ? `.${p}` : p).join("")}`;
}

Path.isPath = arg => arg && arg[isPath];

export default Path;

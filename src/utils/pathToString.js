import is from "./is";

function toString(path, f) {
    if (!path.length) return `$`;

    if (path.length === 1) return is.path(path[0]) ? `${path[0].toString()}` : String(path[0]);

    return `${path
        .map(
            (p, i) =>
                is.path(p)
                    ? `[${p.toString()}]`
                    : is.function(p) ? f ? `(${p})` : `` : i > 0 ? `.${p}` : p
        )
        .join("")}`;
}

export default toString;

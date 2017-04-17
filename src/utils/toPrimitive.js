import { is } from ".";

export default function toPrimitive(keys, sep = ".") {
    const result = keys
        .map((key, idx) => {
            if (is.object(key)) {
                return (
                    "map({" +
                    Object.keys(key).map(k => `${k}:` + toPrimitive([...key[k]])).join(",") +
                    "})"
                );
            }
            if (is.function(key)) {
                return (
                    (!is.function(keys[idx - 1] || idx > 0) ? "(" : "") +
                    (key.displayName || key.name || String(key)) +
                    (!is.function(keys[idx + 1]) ? ")" : ", ")
                );
            }
            return is.array(key) ? "[" + toPrimitive(key) + "]" : (idx > 0 ? sep : "") + key;
        })
        .join("");

    return result;
}

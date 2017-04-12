import { is } from ".";

export default function toPrimitive(keys) {
    return keys
        .map((key, idx) => {
            if (is.function(key)) {
                return (!is.function(keys[idx - 1]) ? "(" : "") +
                    (key.displayName || key.name || String(key)) +
                    (!is.function(keys[idx + 1]) ? ")" : ", ");
            }
            return is.array(key) ? "[" + toPrimitive(key) + "]" : (idx > 0 ? "." : "") + key;
        })
        .join("");
}

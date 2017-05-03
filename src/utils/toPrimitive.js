import { is } from "."

export default function toPrimitive(keys, sep = ".", isKey) {
    const result = keys
        .map((key, idx) => {
            if (is.object(key)) {
                const okeys = Object.keys(key)
                return okeys.length
                    ? "{\n" +
                          okeys
                              .map(k => `${" ".repeat(4)}${k}: ` + toPrimitive([...key[k]], sep))
                              .join(",\n") +
                          "\n}"
                    : "{}"
            }
            if (is.func(key)) {
                if (isKey) {
                    return "function " + (key.displayName || key.name)
                }
                return (
                    (!is.func(keys[idx - 1]) ? "(" : "") +
                    (key.displayName || key.name || String(key)) +
                    (!is.func(keys[idx + 1]) ? ")" : ", ")
                )
            }
            return is.array(key)
                ? "[" + toPrimitive(key, sep, true) + "]"
                : (idx > 0 ? sep : "") + key
        })
        .join("")

    return result
}

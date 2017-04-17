import { is } from "../utils";
import bitbox from "../bitbox";

function map(mapping, object) {
    return new Proxy(mapping, {
        get(target, key) {
            return Reflect.has(target, key)
                ? bitbox.get(object, Reflect.get(target, key))
                : Reflect.get(object, key);
        },
        set(target, key, value) {
            const resolved = is.box(value) ? value(object) : value;

            return Reflect.has(target, key)
                ? bitbox.set(object, Reflect.get(target, key), resolved)
                : Reflect.set(object, key, resolved);
        }
    });
}

export default map;

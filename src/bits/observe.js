import is from "../utils/is";
import { observe } from "../observer";

export default function(box, observer, obj) {
    if (!is.box(box)) return factory(...arguments);

    return box(factory(observer), obj);
}

export function factory(observer) {
    return function get(target, key) {
        return observe(function() {
            const value = is.undefined(key) ? target : target[key];
            observer.call(this, value);
        });
    };
}

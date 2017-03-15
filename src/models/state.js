import { push, unshift } from "../model/methods";

function State(target, path, api) {
    return {
        reset(value) {
            return this.apply(
                function reset(_, value) {
                    return value;
                },
                value
            );
        },
        keys(path) {
            return this.get(path, Object.keys);
        },
        values(path) {
            return this.get(path, Object.values);
        },
        push,
        unshift
    };
}

export default State;

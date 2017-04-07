import { keys, values, push, unshift } from "../model/methods";
import Provider from "../providers/state";

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
        keys,
        values,
        push,
        unshift
    };
}

State.Provider = Provider;

export default State;

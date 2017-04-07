import { is, bit, run } from "../";

function extend(path, construct) {
    return path.$extend(construct);
}

export const props = extend(bit.props, resolve => {
    return function props(path, object) {
        return resolve.apply(this, arguments);
    };
});

export const state = extend(bit.state, resolve => {
    function state(path, object) {
        return resolve.apply(this, arguments);
    }

    return Object.assign(state, resolve, {
        print(object) {
            return this(print, console.log, object);
        }
    });
});

export const signals = extend(bit.signals, resolve => {
    return function signals(path, trap, chain, obj) {
        if (is.trap(trap) && trap.name === "$set") {
            const name = String(path); //.$key;
            const signal = props => run(name, chain, props);
            signal.toString = () => `${name}(props) { [Signal] }`;

            arguments[2] = () => signal;
        }

        return resolve.apply(this, arguments);
    };
});

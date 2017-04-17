import { queue, state } from "./store";
import { is } from "../utils";

/**
 * bitbox.observe
 * Observes observable target
 * @param  {Function}   fn
 * @param  {Array}      args
 * @return {Object}
 */

export default function observe(observer, ...args) {
    if (!is.function(observer)) {
        throw new TypeError(`[bitbox.observe] First argument must be a function`);
    }

    const o = createObserver(observer, args);
    runObserver(o);

    return o;
}

function createObserver(observer, args) {
    return {
        observer,
        args,
        keys: [],
        paths: [],
        changes: [],
        changed: 0,
        name: observer.displayName || observer.name,
        run(...args) {
            return runObserver(this, args);
        },
        skip() {
            return queue.delete(this);
        },
        unobserve() {
            if (this.observer) {
                this.keys.forEach(observers => {
                    observers.delete(this);
                });
                this.observer = this.paths = this.args = this.keys = undefined;
                queue.delete(this);
            }
        }
    };
}

export function runObserver(o, args) {
    let result;
    try {
        state.currentObserver = o;
        result = o.observer.apply(undefined, args ? o.args.concat(args) : o.args);
    } finally {
        state.currentObserver = undefined;
        if (!args) {
            o.changed++;
            o.changes = [];
        }
    }
    return result;
}

export function runObservers() {
    queue.forEach(o => runObserver(o));
    queue.clear();
    state.queued = false;
}

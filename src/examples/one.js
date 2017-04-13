import bitbox, { set, observable } from "../main";
import { inc } from "../bits";

export const app = bitbox([
    function resolve(resolve, object, keys) {
        console.log(`resolve, object, keys`, { resolve, object, keys });
        return resolve(observable(object), keys);
    }
]);

export const state = app.state();
export const signals = app.signals();

export const store = app({
    count: 0
});

bitbox.observe(({ count }) => console.warn(`count = ${count}`), store);
bitbox.observe(({ name }) => console.warn(`name = ${name}`), store);

app.name(set, `Demo App`, store);
app.count(set, inc, store);

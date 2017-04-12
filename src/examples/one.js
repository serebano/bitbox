import bitbox from "../";

const app = bitbox();
const state = app.state();
const signals = app.signals();
const modules = app.modules();

function Store(object) {
    const store = bitbox.observable(object);

    return store;
}

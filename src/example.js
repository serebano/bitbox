import * as bitbox from ".";
import * as bits from "./bits";
import * as paths from "./paths";
import { render } from "react-dom";
import { bit, path, run, component } from ".";
import { state, signal, props } from "./paths";
import { set, assign, toggle, print, inc, dec, gt } from "./bits";
import App from "./examples/components/app";

const object = bit({
    state: {
        title: "Demo",
        count: 0,
        index: 0,
        enabled: true,
        items: ["One", "Two"],
        timers: {
            foo: {
                value: 0
            }
        },
        id: "foo"
    },
    signals: {}
});

run.context = object;

const timers = path.extend(state.timers, resolve => {
    function timers() {
        return resolve(...arguments);
    }

    return Object.assign(timers, resolve, {
        add(value, obj) {
            return set(
                this,
                {
                    name: String(this.$key),
                    value: value || 0
                },
                obj
            );
        }
    });
});

const add = (path, value, object) => path.$add(value, object);
const action = action => props => run(action, props);

add(timers.xxx, 100, object);
add(timers.abc, 200, object);

// set enabled if count is greater then 5
set(state.enabled, state.count(gt(5)), object);
// stringify timers and log
timers(print, console.log, object);
// run multiple actions
run([set(state.repos, { serebano: {} }), set(state.name, `bitbox`)]);

run(
    assign(signal, {
        incClicked: action(set(state.count, inc)),
        decClicked: action(set(state.count, dec)),
        nameChanged: action(set(state.name, props.value)),
        toggleClicked: action(set(state.enabled, toggle))
    })
);

//state(on(({ count }) => console.log(`{{count}}: ${count}`)))(object);

// const mapping = {
//     count: state.count,
//     items: state.items(items => items.map(String)),
//     computed: [state.count, 10, (a, b) => a + b],
//     item: state.items[state.items(items => items.length - 1)],
//     color: state.enabled(enabled => enabled ? "red" : "green")
// };
//
// const mapped = bit(object, mapping);
// box(({ count, item }) => console.log(`count`, count, item), mapped);

render(component(App, object), document.querySelector("#root"));

Object.assign(window, bitbox, paths, bits, {
    bitbox,
    obj: object,
    timers,
    action
});

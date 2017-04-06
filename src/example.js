import * as bb from ".";
import * as bits from "./bits";
import { render } from "react-dom";
import { bit, path, run, component } from ".";
import { state, signal, props } from "./paths";
import { set, assign, toggle, print } from "./bits";
import App from "./examples/components/app";

const object = bit({
    state: {
        title: "Demo",
        count: 0,
        items: ["One", "Two"],
        index: 0,
        enabled: true,
        timers: {
            foo: {
                value: 0
            },
            bar: {
                value: 0
            },
            baz: {
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
                    name: this.$key,
                    value: value || 0
                },
                obj
            );
        }
    });
});

const add = (path, value, obj) => path.$add(value, obj);

add(timers.xxx, 100, object);
add(timers.abc, 200, object);

timers(print, console.log, object);

const r = action => {
    return props => {
        return run(
            context => {
                action(context);
            },
            props
        );
    };
};

run([
    ctx => {
        set(state.repos, { serebano: {} })(ctx);
    },
    ctx => {
        set(state.name, `bitbox`)(ctx);
    },
    assign(signal, {
        incClicked: r(set(state.count, count => count + 1)),
        decClicked: r(set(state.count, count => count - 1)),
        nameChanged: r(set(state.name, props.value)),
        toggleClicked: r(toggle(state.enabled))
    })
]);

// assign(signal, {
//     incClicked: props => run(set(state.count, count => count + 1), props),
//     decClicked: props => run(set(state.count, count => count - 1), props),
//     nameChanged: props => run(set(state.name, props.value), props),
//     toggleClicked: props => run(toggle(state.enabled), props)
// })(object);

//state(on(({ count }) => console.log(`{{count}}: ${count}`)))(object);

//ctx => state.name(state => event => state.name = event.target.value)

// state.paths(object, new Set());
// state.paths(object).add(state.count);
//
// const bx = box(
//     ({ state }) => {
//         console.log(`paths: ${state.paths.size}`);
//
//         for (let path of state.paths) {
//             console.log(`path:`, path.$path, path(object));
//         }
//     },
//     object
// );
//
// state.paths(object).add(state.title);
// state.paths(object).add(state.enabled(o => o ? "red" : "blue"));
// state.title(object, `bitbox!`);
//
// toggle(state.enabled)(object);

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

Object.assign(window, bb, bits, {
    bb,
    obj: object,
    //set,
    //bx,
    toggle,
    state,
    props,
    timers,
    r,
    signal
    //mapping,
    //mapped
});

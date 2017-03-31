/** @jsx h */
import bit from "../../bit";
import component from "../../views/react";
import { render } from "react-dom";
import run from "../../run";
import { push, pop } from "../../operators";
import box from "../../box";
import is from "../../is";
import observe from "../../observe";
import path from "../../path";

const state = path({}, ["state"], true);
const props = path({}, ["props"], true);

const signals = path({}, ["signals"], true, [
    signal => {
        return function runSignal(props) {
            return run(signal, props);
        };
    }
]);

window.state = state;
window.props = props;
window.signals = signals;

function Hello(props, h) {
    return (
        <form>
            <h2>Hello {props.name}</h2>
            <input onChange={props.nameChanged} id={props.cid} value={props.name} />
        </form>
    );
}

Hello.map = {
    name: state[props.cid].use(props.cid, (name, id) => name || "World" + " " + id),
    nameChanged: state.use(props.cid, (state, id) => event => state[id] = event.target.value)
};

function Counter(props, h) {
    return (
        <div style={{ border: "1px solid #ccc", padding: 4 }}>
            <span>{props.cid} -&gt; <strong>({props.count})</strong></span>
            <button onClick={() => props.inc({ cid: props.cid })}>Increment</button>
            <button onClick={() => props.dec({ cid: props.cid })}>Decrement</button>
        </div>
    );
}

Counter.map = {
    count: state[props.cid], //.use(n => n || 0),
    inc: signals.increment,
    dec: signals.decrement
};

function Changes(props, h) {
    return (
        <div>
            <p>Changes({props.size})</p>
            <div>
                {props.changes.map((change, key) => (
                    <div key={key} style={{}}>
                        <code
                            style={{
                                fontSize: 13,
                                display: "block",
                                borderBottom: "1px solid #eee",
                                padding: 4
                            }}
                        >
                            <b style={{ color: "#e45649" }}>{change.type}</b>
                            [
                            {change.path.join(".")}
                            ]
                        </code>
                        <pre style={{ opacity: 0.5, padding: 4, margin: 0, marginBottom: 8 }}>
                            <u>{change.name}</u>
                            {" "}
                            =
                            {" "}
                            {is.object(change.object[change.name])
                                ? JSON.stringify(change.object[change.name], null, 4)
                                : String(change.object[change.name])}
                        </pre>
                    </div>
                ))}
            </div>
        </div>
    );
}

Changes.map = {
    size: state.changes.length,
    changes: state.changes
    //.use(changes =>
    //    changes.slice(changes.length - 5).map(c => ({ ...c, value: c.object[c.name] })))
};

function App({ components, add, pop }, h) {
    return (
        <div>
            <button onClick={() => add({ value: Counter })}>add counter</button>
            <button onClick={() => add({ value: Hello })}>add hello</button>
            <button onClick={() => pop()}>pop</button>
            <div>
                {components.map((Component, key) => (
                    <div key={key}><Component cid={`${Component.name}${key}`} /></div>
                ))}
            </div>
        </div>
    );
}

App.map = {
    add: signals.add,
    pop: signals.pop,
    components: state.components
};

const app = bit({
    components: new Set(),
    state: {
        count: 0,
        components: [],
        renders: {},
        changes: []
    },
    signals: {
        add: push(state.components, props.value),
        pop: pop(state.components),
        increment({ state, props }) {
            state[props.cid] = (state[props.cid] || 0) + 1;
        },
        decrement({ state, props }) {
            state[props.cid] = (state[props.cid] || 0) - 1;
        }
    }
});

export default app;

// window.rc = box(function renders() {
//     console.log(`renders *** \n`, Object.assign({}, app.state.renders));
// });
//
// box(function Components() {
//     console.log(`Connections: [${app.components.size}] *** \n`);
//
//     //console.log(app.components.map(c => `${c.name}#${c.index}(${c.renderCount})`).join("\n"));
//     app.components.forEach(component => {
//         console.log(component.name, component.renderCount);
//     });
// });

run.providers.push(function State(context) {
    context.state = app.state;
    return context;
});

run.on("error", (e, a) => console.log(`run/error`, e, a));

render(component(App, app), document.querySelector("#root"));

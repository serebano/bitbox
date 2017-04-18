/** @jsx h */
import bitbox from "../bitbox";
import component from "../views/react";
import { render } from "react-dom";
import { compute, join, or, inc, set } from "../operators";
import store, { root, props, state, foo, deep, count, app } from "./app";
import Count from "./components/count";

export { root, props, state, foo, deep, count, app, store, component };

export function App(props, h) {
    return (
        <div>
            <Count />
            <Demo id={props.id} />
        </div>
    );
}

App.map = {
    id: state.id,
    foo: foo(Object.keys)
};

export function Demo(props, h) {
    return (
        <div>
            <h2>{props.name}</h2>
            <h3 style={{ color: props.color }}>Count = {props.count}</h3>
            <input onChange={e => props.name = e.target.value} value={props.name} />
            <button onClick={() => props.count++}>Inc(+)</button>
            <button onClick={() => props.count--}>Dec(-)</button>
        </div>
    );
}

Demo.map = {
    id: props.id,
    name: state.name,
    count: ["state", "count"],
    color: state.color(or("blue"))
};

export const one = bitbox({
    count: state.count,
    name: state.name,
    computed: bitbox(compute(state.count, state.name, join(` | `)))
});

//bitbox.observe(state => console.info(`{ name = ${state.name}, count = ${state.count} }`), one(store));

state(store).count++;
set(state.count, state.count(inc), store);
set(state.name, `bitbox demo`, store);

// setInterval(() => {
//     bitbox.set(store, count, state.count(inc, store));
// }, 1);

component.debug = true;

render(component(App, store), document.querySelector("#root"));

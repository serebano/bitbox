/** @jsx h */
import bit from "../../bit";
import component from "../../views/react";
import { render } from "react-dom";

function Hello(props, h) {
    return (
        <form>
            <h1>Hello {props.name}</h1>
            <input onChange={props.nameChanged} value={props.name} />
        </form>
    );
}

Hello.map = {
    name: bit.state.name.use(name => name || "World"),
    nameChanged: bit.state.use(state => e => state.name = e.target.value)
};

function Counter(props, h) {
    return (
        <div>
            <h1>count: {props.count}</h1>
            <button onClick={props.inc}>Increment</button>
            <button onClick={props.dec}>Decrement</button>
        </div>
    );
}

Counter.map = {
    count: bit.state.count,
    inc: bit.signals.increment.use(bit.state, (fn, state) => e => fn({ state }, e)),
    dec: bit.signals.decrement.use(bit.state, (fn, state) => e => fn({ state }, e))
};

function App(props, h) {
    return (
        <section>
            <ul>
                {props.components.map((Component, key) => <li key={key}><Component /></li>)}
            </ul>
        </section>
    );
}

App.map = {
    components: bit.state.components.use(c => c.map(i => {
        console.log(i.name);
        return i;
    }))
};

const store = {
    state: {
        count: 0,
        components: [Hello, Counter]
    },
    signals: {
        increment(context) {
            context.state.count++;
        },
        decrement(context) {
            context.state.count--;
        }
    }
};

render(component(App, store), document.querySelector("#root"));

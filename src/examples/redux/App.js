import React from "react";
import component from "../../views/react";
import { compose, state, signal } from "../../tags";
import ComposeDemo from "../compose";

const Composed = compose(ComposeDemo);
const App = component({}, function App() {
    return (
        <div>
            <Name />
            <Count />
            <Composed />
        </div>
    );
});

const Name = component({ name: state`name` }, function Name({ name }) {
    return <h1>#{name}</h1>;
});

const Count = component(
    {
        count: state`count`,
        inc: signal`increment`,
        dec: signal`decrement`
    },
    function Count({ count, inc, dec }) {
        return (
            <div>
                <hr />
                <button onClick={() => inc()}>+</button>
                <span>{count}</span>
                <button onClick={() => dec()}>-</button>
            </div>
        );
    }
);

export default App;

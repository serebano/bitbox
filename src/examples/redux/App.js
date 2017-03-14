import React from "react";
import Component from "../../Component";

const Name = Component(
    ({ state }) => {
        return {
            name: state`name`
        };
    },
    function Name({ name }) {
        return (
            <div>
                <h2>{name}</h2>
            </div>
        );
    }
);

const Count = Component(
    ({ state, signal }) => {
        return {
            count: state`count`,
            increment: signal`increment`,
            decrement: signal`decrement`
        };
    },
    function Count({ count, increment, decrement }) {
        return (
            <div>
                <button onClick={() => increment()}>+</button>
                {count}
                <button onClick={() => decrement()}>-</button>
            </div>
        );
    }
);

export default Component({}, function App() {
    return (
        <div>
            <Name />
            <Count />
        </div>
    );
});

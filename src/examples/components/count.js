/** @jsx h */
import { state, signal } from "../../api";
import { inc, dec } from "../../operators";

function Count({ count, incClicked, decClicked }, h) {
    return (
        <div style={{ padding: 16, border: "1px solid #c00" }}>
            <button onClick={() => incClicked()}>+ Increment</button>
            <strong>{count}</strong>
            <button onClick={() => decClicked()}>- Decrement</button>
        </div>
    );
}

Count.map = {
    count: state.count(c => `( ${c} )`),
    incClicked: signal(signals => {
        if (!signals.incClicked) return signal.incClicked(signals, inc(state.count));
        return signal.incClicked(signals);
    }),
    decClicked: signal(signals => {
        if (!signals.incClicked) return signal.incClicked(signals, dec(state.count));
        return signal.incClicked(signals);
    })
};

export default Count;

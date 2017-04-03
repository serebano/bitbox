/** @jsx h */
import { state, signal } from "../../api";

function Count({ count, incClicked, decClicked, $observer }, h) {
    return (
        <div style={{ padding: 16, border: "1px solid #c00" }}>
            <button onClick={() => incClicked()}>+ Increment</button>
            <strong> - {count} - </strong>
            <button onClick={() => decClicked()}>- Decrement</button>
            <pre>{JSON.stringify($observer, null, 4)}</pre>
        </div>
    );
}

Count.map = {
    count: state.count(String),
    incClicked: signal.incClicked,
    decClicked: signal.decClicked
};

export default Count;

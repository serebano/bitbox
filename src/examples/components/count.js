/** @jsx h */
import { state, signal } from "../../paths";

function Count({ count, incClicked, decClicked }, h) {
    return (
        <div style={{ padding: 16, border: "1px solid #c00" }}>
            <button onClick={() => incClicked()}>+ Increment</button>
            <strong> - {count} - </strong>
            <button onClick={() => decClicked()}>- Decrement</button>
        </div>
    );
}

Count.map = {
    count: state.count(String),
    incClicked: signal.incClicked,
    decClicked: signal.decClicked
};

export default Count;

/** @jsx h */
import { state } from "../../api";

function Toggle(props, h) {
    return (
        <div style={{ background: props.color }}>
            <button onClick={props.clicked}>Toggle {String(props.value)}</button>
        </div>
    );
}

Toggle.map = {
    value: state.enabled,
    color: state.enabled(enabled => enabled ? "red" : "green"),
    clicked: state(state => () => state.enabled = !state.enabled)
};

export default Toggle;

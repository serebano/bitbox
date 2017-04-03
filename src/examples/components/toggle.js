/** @jsx h */
import { state } from "../../api";

function Toggle(props, h) {
    return (
        <div style={{ background: props.color, padding: 16 }}>
            <button onClick={props.clicked}>Toggle ({props.value})</button>
        </div>
    );
}

Toggle.map = {
    value: state.enabled(enabled => enabled ? "on" : "off"),
    color: state.enabled(enabled => enabled ? "green" : "#555"),
    clicked: state(state => () => state.enabled = !state.enabled)
};

export default Toggle;

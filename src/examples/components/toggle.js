/** @jsx h */
import { state, signals } from "../app";

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
    clicked: signals.toggleClicked
};

export default Toggle;

/** @jsx h */
import { state, signal } from "../../paths";

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
    clicked: signal.toggleClicked
};

export default Toggle;

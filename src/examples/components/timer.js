/** @jsx h */
import { state, props } from "../../paths";
import { or } from "../../bits";

function Remove({ onRemove, label }, h) {
    return (
        <div style={{ padding: "6px 0" }}>
            <button onClick={onRemove}>x ({label})</button>
        </div>
    );
}
Remove.map = {};

function Timer({ timer, started, stopped, id, color, removeClicked }, h) {
    return (
        <div style={{ padding: 16, border: "1px solid #c00", fontSize: 18, color }}>
            <button onClick={() => timer.startStop()}>[{timer.running ? "stop" : "start"}]</button>
            <Remove label={id} onRemove={() => removeClicked({ id })} />
            <span> *{id}* <strong>{timer.value}</strong></span>
        </div>
    );
}

Timer.map = {
    color: state.color(or("#555")),
    removeClicked: state.timers(object => {
        return props => {
            clearInterval(object[props.id].iid);
            delete object[props.id];
        };
    }),
    timer: state.timers[props.id]((timer = {}) => ({
        value: timer.value,
        running: timer.running,
        startStop() {
            clearInterval(timer.iid);
            if (!timer.running) timer.iid = setInterval(() => timer.value++, 10);
            timer.running = !timer.running;
        }
    }))
};

export default Timer;

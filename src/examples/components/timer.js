/** @jsx h */
import { state, props } from "../../api";
import { or } from "../../bits";

function Remove({ id, removeClicked }, h) {
    return (
        <div style={{ padding: "6px 0" }}>
            <button onClick={() => removeClicked({ id })}>x ({id})</button>
        </div>
    );
}

Remove.map = {
    removeClicked: state.timers(object => {
        return props => {
            clearInterval(object[props.id].iid);
            delete object[props.id];
        };
    })
};

function Timer({ timer, started, stopped, id, color }, h) {
    return (
        <div style={{ padding: 16, border: "1px solid #c00", fontSize: 24, color }}>
            <button onClick={() => timer.startStop()}>[{timer.running ? "stop" : "start"}]</button>
            <span> *{id}* <strong>{timer.value}</strong></span>
            <Remove id={id} />
        </div>
    );
}

Timer.map = {
    color: state.color(or("#555")),
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

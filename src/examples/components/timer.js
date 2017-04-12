/** @jsx h */
import { state, props, signals } from "../../paths";

const timer = state.timers[props.id]();

function Remove({ remove, id }, h) {
    return <button onClick={() => remove({ id })}>remove ({id})</button>;
}

Remove.map = {
    remove: signals.timerRemoved
};

function Toggle({ toggle, id, running }, h) {
    return <button onClick={() => toggle()}>toggle ({id}) / [{running ? "stop" : "start"}]</button>;
}

Toggle.map = {
    toggle: timer((timer = {}) => {
        return () => {
            clearInterval(timer.iid);
            if (!timer.running) timer.iid = setInterval(() => timer.value++, 10);
            timer.running = !timer.running;
        };
    }),
    running: timer.running
};

function Value({ value, id }, h) {
    return (
        <div style={{ padding: "6px 0", color: "#c00" }}>
            {id} = <strong>{value}</strong>
        </div>
    );
}

Value.map = {
    value: timer.value(String)
};

function Timer({ id, background }, h) {
    return (
        <div style={{ padding: 16, border: "1px solid #c00", fontSize: 18, background }}>
            <Toggle id={id} />
            <Remove id={id} />
            <Value id={id} />
        </div>
    );
}

Timer.map = {
    background: timer.running(value => value === true ? "#fff" : "#eee")
};

export default Timer;

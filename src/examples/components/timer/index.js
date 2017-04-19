/** @jsx h */
import timer from "./timer"
import Value from "./value"
import Remove from "./remove"
import Toggle from "./toggle"

function Timer({ id, background }, h) {
    return (
        <div style={{ padding: 16, border: "1px solid #c00", fontSize: 18, background }}>
            <Toggle id={id} />
            <Remove id={id} />
            <Value id={id} />
        </div>
    )
}

Timer.map = {
    background: timer.running(value => (value === true ? "#fff" : "#aaa"))
}

export default Timer

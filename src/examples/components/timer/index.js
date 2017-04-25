/** @jsx h */
import Value from "./value"
import Remove from "./remove"
import Toggle from "./toggle"
import app from "../../app"

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
    id: app.id,
    background: app.timer.iid(id => (id ? "#fff" : "#aaa"))
}

export default Timer

/** @jsx h */
import timer from "./timer"
import { signals } from "../../app"

function Toggle({ toggle, props, running }, h) {
    return (
        <button onClick={() => toggle(props)}>
            toggle ({props.id}) / [{running ? "stop" : "start"}]
        </button>
    )
}

Toggle.map = {
    toggle: signals.timerToggled,
    running: timer.running
}

export default Toggle

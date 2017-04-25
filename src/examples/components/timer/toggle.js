/** @jsx h */
import { props, signals, timer } from "../../app"

function Toggle({ toggle, id, label }, h) {
    return (
        <button onClick={() => toggle({ id })}>
            {id} [{label}]
        </button>
    )
}

Toggle.map = {
    id: props.id,
    toggle: signals.timerToggled,
    label: timer.iid(function label(id) {
        return id > 0 ? "stop" : "start"
    })
}

export default Toggle

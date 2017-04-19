/** @jsx h */
import timer from "./timer"

function Value({ value, props }, h) {
    return (
        <div style={{ padding: "6px 0", color: "#444" }}>
            {props.id} = <strong>{value}</strong>
        </div>
    )
}

Value.map = {
    value: timer.value(String)
}

export default Value

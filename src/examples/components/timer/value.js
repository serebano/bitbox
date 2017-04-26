/** @jsx h */
import { props, timer } from "../../app"

function Value({ value, props }, h) {
    return (
        <div style={{ padding: "6px 0", color: "#444" }}>
            {props.id} = <strong>{value}</strong>
        </div>
    )
}

Value.map = {
    props,
    value: timer.value(String)
}

export default Value

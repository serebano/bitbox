/** @jsx h */
import { signals } from "../../app"

function Remove({ remove, props }, h) {
    return <button onClick={() => remove(props)}>Remove ({props.id})</button>
}

Remove.map = {
    props: ["props"],
    remove: signals.timerRemoved
}

export default Remove

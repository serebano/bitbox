/** @jsx h */
import app, { observer } from "../app"
import { stringify } from "../../operators"
import mapping from "../mapping"

function Mapped(props, h) {
    return (
        <div>
            <div style={{ background: "#f4f4f4", padding: 8 }}>
                <b>changes({props.changed}):</b>
                <div>
                    {props.changes.map((path, idx) => (
                        <div><code key={path}>[{idx}] {path.join(".")}</code></div>
                    ))}
                </div>
            </div>
            <pre style={{ color: props.color }}>{props.str}</pre>
        </div>
    )
}

Mapped.map = {
    changes: observer.changes,
    changed: observer.changed,
    str: app(mapping, stringify),
    color: mapping.color
}

export default Mapped

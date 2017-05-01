import bitbox, { map, mapping, observable, observe } from "../bitbox"
import { delay, stringify } from "../operators"
import React from "react"
import ReactDOM from "react-dom"

const target = {
    state: observable({
        count: 0,
        name: "bitbox",
        observing: true
    }),
    observer: {}
}

const it = delay((text, run) => console.info(text, (window.res = run(window))), 1000)

it("creates box from arguments", o => {
    const app = bitbox(
        mapping({
            state: {
                name: ["name"],
                count: ["count", Number],
                keys: Object.keys
            }
        })
    )
    o.app = app
    return app(target)
})

it("creates bit box component", o => {
    const mapping = {
        name: ["state", "name"],
        count: ["state", "count"],
        increment: ["state", state => () => state.count++],
        decrement: ["state", state => () => state.count--],
        setName: ["state", state => e => state.name = e.target.value],
        changed: ["observer", "changed"],
        toggleObserver: [
            target => {
                return () => {
                    if (target.observer.keys) {
                        target.state.observing = false
                        setTimeout(() => target.observer.off())
                    } else {
                        target.state.observing = true
                        target.observer.on()
                    }
                }
            }
        ],
        status: ["state", "observing", observing => (observing ? "on" : "off")],
        changes: [
            "observer",
            o => ({
                paths: o.paths && o.paths.map(p => p.join(".")).join(", "),
                changes: o.changes && o.changes.map(p => p.join(".")).join(", ")
            })
        ]
    }

    function Counter(props) {
        const {
            count,
            increment,
            decrement,
            toggle,
            setName,
            name,
            changed,
            changes,
            toggleObserver,
            status
        } = props

        return (
            <div
                style={{ transition: "opacity 0.5s ease-out", opacity: status === "on" ? 1 : 0.1 }}>

                <div
                    style={{
                        color: "#555",
                        fontSize: 18,
                        fontFamily: "monospace, monospace",
                        background: "#f4f4f4",
                        padding: 16
                    }}>
                    bitbox(
                    <span style={{ color: "#183691", margin: "0 3px" }}>
                        {changes.changes}
                    </span>
                    )
                    <span style={{ color: "#a71d5d", opacity: 0.5, marginLeft: 24 }}>
                        {changed}
                    </span>
                    <hr />
                    <div style={{ fontSize: 13, opacity: 0.7 }}>
                        <button onClick={toggleObserver}>observer [{status}]</button>
                        <span style={{ marginLeft: 24 }}>
                            [ {changes.paths} ]
                        </span>
                    </div>
                </div>

                <h2>count = {count}</h2>
                <button onClick={increment}>increment</button>
                <button onClick={decrement}>decrement</button>
                <hr />
                <h2>{name}</h2>
                <input onChange={setName} value={name} />
            </div>
        )
    }

    const render = props =>
        ReactDOM.render(React.createElement(Counter, props), document.querySelector("#root"))

    target.observer = bitbox.observe(bitbox.map(target, mapping), render)

    o.comTarget = target
    o.comMapping = mapping

    observe(bitbox(map(mapping), print))(target)
})

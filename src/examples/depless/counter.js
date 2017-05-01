/** @jsx h */
import Debug from "./debug"

export default [
    function({ state, props, observer }) {
        const counter = state.counters[props.id]()

        return {
            count: counter.count(String),
            status: counter.runId(id => id || "stopped"),
            inc: counter(target => () => target.count++),
            dec: counter(target => () => target.count--),
            set: counter(target => event => target.count = Number(event.target.value || 0)),
            run: counter(target => () =>
                target.runId = target.runId
                    ? clearInterval(target.runId)
                    : setInterval(() => target.count++)),
            remove(target) {
                return () => {
                    clearInterval(counter.runId(target))
                    state.counters(target).splice(props.id(target), 1)
                }
            },
            observer: observer
        }
    },
    function Counter({ count, inc, dec, set, run, status, remove, observer }, h) {
        return (
            <main style={{ background: "#f4f4f4", padding: 8 }}>
                <div>
                    <button onClick={remove}>x</button>
                    <input onInput={set} value={count} />
                    <button onClick={inc}>+</button>
                    <button onClick={dec}>-</button>
                    <button onClick={run}>run [{status}]</button>
                </div>
                <Debug observer={observer} />
            </main>
        )
    }
]

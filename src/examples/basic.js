import bitbox from "../bitbox"
import { or, inc, dec } from "../operators"
import { is } from "../utils"

const store = {
    state: bitbox.observable({
        counters: {
            foo: { count: 0 },
            bar: { count: 0 },
            baz: { count: 0 }
        },
        selected: "foo"
    })
}

const app = bitbox({
    args(target) {
        return (target.args || []).map(arg => (is.box(arg) ? arg(target) : arg))
    },
    state: ["state"],
    counter: ["state", "counters", ["state", "selected"]]
})

const { args, state, counter } = app

const set = (box, value) => {
    return target => {
        return (...args) => {
            return box(Object.assign({ args }, target), Reflect.set, value)
        }
    }
}

function Component(props) {
    window.props = props
    return `
        <h1>${props.selected} = ${props.count}</h1>
		${props.counters.map(id => `<button onclick="props.select('${id}')">${id}</button>`).join("")}
		<hr />
        <button onclick="props.inc()">Inc</button>
        <button onclick="props.dec()">Dec</button>
        <button onclick="props.reset()">Reset</button>

    `
}

Component.map = {
    count: counter.count,
    selected: state.selected,
    counters: state.counters(Object.keys),
    inc: set(counter.count, counter.count(inc)),
    dec: set(counter.count, counter.count(dec)),
    reset: set(counter.count, args(0, or(0))),
    select: set(state.selected, args(0, or("bar"))),
    add: set(
        state.counters[args(0, or(state.counters(Object.keys).length(i => `counter ${i}`)))],
        args(1, (count = 0) => ({
            count
        }))
    )
}

bitbox.observe(
    store,
    bitbox(Component.map, Component, function render(html) {
        document.body.innerHTML = html
    })
)

//set(state.count, args(0).foo(or(state.count(inc))))(store)({foo: 10000})

import bitbox, { observable } from "../bitbox"
import { set, inc, dec, signal, join, or } from "../operators"
import run from "../operators/run"

export const root = bitbox.root()
export const deep = root.more("deep")
export const signals = root.signals
export const props = root.props
export const state = root.state
export const foo = root.foo
export const count = state.count(String)
export const app = bitbox({ props, state, deep, foo, count, keys: bitbox(Object.keys) })
export const args = bitbox(function args(target) {
    return Reflect.get(target, Symbol.for("args")) || Array.from(target)
})

const store = {
    state: observable({
        id: 1,
        name: "Demo",
        count: 0,
        items: {
            foo: 1,
            bar: 2,
            baz: 3
        },
        item: "foo"
    }),
    signals: {
        incClicked: signal(set(state.count, state.count(inc))),
        decClicked: signal(set(state.count, state.count(dec))),
        nameChanged: signal(set(state.name, args(0, or("Demo"))))
    },
    actions: {
        setName() {
            bitbox.set(this, state.name, args(join(" * "), arguments))
            bitbox.set(this, state.count, state.count(inc))
        }
    },
    foo: observable({ count: 7 }),
    more: {
        deep: { count: 3 }
    }
}

signal.run = run(
    function argsProvider(context, action, props) {
        const args = props.args || []
        context.props = args[0] || {}
        context[Symbol.for("args")] = args

        return context
    },
    function stateProvider(context) {
        context.state = store.state
        return context
    }
).run

export default store

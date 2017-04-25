import bitbox from "../bitbox"

const app = bitbox({
    args(target) {
        return Reflect.get(target, Symbol.for("args")) || Array.from(target)
    },
    state: ["state"],
    props: ["props"],
    signals: ["signals"],
    observer: ["observer"],
    timer: [
        "state",
        "timers",
        [
            function id(target) {
                return target.props ? app.props.id(target) : app.state.id(target)
            }
        ]
    ]
})

export default app

export const { args, props, state, signals, observer, timer } = app

//bitbox.observe(app(map(App.map), stringify, console.info), store)

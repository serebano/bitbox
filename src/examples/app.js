import bitbox from "../bitbox"

const app = bitbox({
    args(target) {
        return Reflect.get(target, Symbol.for("args")) || Array.from(target)
    },
    state: ["state", bitbox.observable],
    timer: ["state", "timers", ["state", "id"], bitbox.observable],
    props: ["props"],
    signals: ["signals"],
    observer: ["observer"]
})

export default app

export const { args, state, props, signals, observer } = app

import { join } from "../operators"
import { args, state } from "./app"

export default {
    state: {
        name: "Demo",
        count: 0,
        counters: {
            foo: 1,
            bar: 2,
            baz: 3
        },
        selected: "foo",
        title: "Demo",
        index: 0,
        enabled: true,
        nativeSet: new Set(["One", "Two"]),
        timers: {
            one: {
                value: 0
            }
        },
        items: ["Item #1", "Item #2"],
        id: "one"
    },
    signals: {}
}

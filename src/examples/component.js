import Component, { render } from "../views/inferno"
import Counter from "./depless/counter"

Component.observable = false

render(
    Component(Counter, {
        props: {
            color: "blue"
        },
        state: {
            counters: [{ count: 1 }, { count: 2 }]
        }
    }),
    "#root"
)

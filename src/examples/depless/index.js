import Component, { render } from "../../views/inferno"
import Counters from "./counters"

render(
    Component(Counters, {
        props: {
            color: "blue"
        },
        state: {
            counters: [{ count: 1 }, { count: 2 }]
        }
    }),
    "#root"
)

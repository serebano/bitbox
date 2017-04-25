/** @jsx h */
import { state } from "../app"
import { or, stringify } from "../../operators"
import { is } from "../../utils"
import Hello from "./hello"
import Count from "./count"
import Toggle from "./toggle"
import Timer from "./timer"
import Mapped from "./mapped"

function App(props, h) {
    return (
        <div>
            <h1>{props.title}</h1>
            {props.isObservable ? <Mapped /> : null}
            <Hello />
            <Count />
            <Toggle />
            <hr />
            <div>
                {props.timers.map(key => <Timer key={key} id={key} />)}
            </div>
            <pre>{props.debug}</pre>
        </div>
    )
}

App.map = {
    title: state.title(or("Demo App")),
    timers: state.timers(Object.keys),
    isObservable: state(is.observable),
    debug: state.debug(or({}), stringify)
}

export default App

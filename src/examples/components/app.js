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
            <pre>{props.debug}</pre>
            {props.isObservable ? <Mapped /> : null}
            <h1>{props.title}</h1>
            <Hello />
            <Count />
            <Toggle />
            <hr />
            <div>
                {props.timers.map(key => <Timer key={key} id={key} />)}
            </div>
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

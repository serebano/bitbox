/** @jsx h */
import { state } from "../../api";
import { or } from "../../bits";
import Hello from "./hello";
import Count from "./count";
import Toggle from "./toggle";
import Timer from "./timer";
import Github from "./github";

function App(props, h) {
    return (
        <div>
            <h1>{props.title}</h1>
            <Github user="serebano" />
            <Hello />
            <Count />
            <Toggle />
            <hr />
            <div>
                {props.timers.map((id, key) => <Timer key={key} id={id} />)}
            </div>
        </div>
    );
}

App.map = {
    title: state.title(or("Demo App")),
    timers: state.timers(Object.keys)
};

export default App;

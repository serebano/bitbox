/** @jsx h */
import { state, props } from "../../api";
import { or, eq, ensure, is, concat } from "../../bits";

function Hello(props, h) {
    return (
        <form>
            <h2>Hello {props.name}</h2>
            <input onChange={props.nameChanged} value={props.name} />
            <pre>{JSON.stringify(props, null, 4)}</pre>
        </form>
    );
}

Hello.map = {
    name: state.name(or(`World`)),
    enabled: state.color(eq("green")),
    exists: state(ensure("users", { foo: { name: "Foo" } }))[props.id(or("foo"))](is("object")),
    nameChanged: state(s => e => s.name = e.target.value),
    array: state.items(concat(state(Object.keys, concat(state.timers(Object.keys)))))
};

export default Hello;

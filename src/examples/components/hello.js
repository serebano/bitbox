/** @jsx h */
import { state, signals } from "../app";
import { or } from "../../bits";

function Hello(props, h) {
    return (
        <form>
            <h2>Hello {props.value}</h2>
            <input
                onChange={e => props.nameChanged({ value: e.target.value })}
                value={props.value}
            />
        </form>
    );
}

Hello.map = {
    value: state.name(or(`World`)),
    nameChanged: signals.nameChanged
};

export default Hello;

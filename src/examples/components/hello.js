/** @jsx h */
import { state, signals } from "../../paths";
import { or } from "../../bits";

function Hello({ value, nameChanged }, h) {
    return (
        <form>
            <h2>Hello {value}</h2>
            <input onChange={e => nameChanged({ value: e.target.value })} value={value} />
        </form>
    );
}

Hello.map = {
    value: state.name(or(`World`)),
    nameChanged: signals.nameChanged
};

export default Hello;

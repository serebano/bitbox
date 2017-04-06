/** @jsx h */
import { state, signal } from "../../api";
import { or, set } from "../../bits";
// import Run from "../../run";

function Hello({ value, nameChanged }, h) {
    //console.log(`Helo`, { value, nameChanged });
    return (
        <form>
            <h2>Hello {value}</h2>
            <input onChange={e => nameChanged({ value: e.target.value })} value={value} />
        </form>
    );
}

// function run(action) {
//     return function signal(props) {
//         console.log(`signal`, action, props);
//         Run(
//             context => {
//                 console.log(`run/context`, context);
//                 const res = action(context);
//                 console.log(`run/res`, res);
//             },
//             props
//         );
//     };
// }

Hello.map = {
    value: state.name(or(`World`)),
    nameChanged: signal.nameChanged
};

export default Hello;

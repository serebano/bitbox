import Store from "../../Redux";
import { state, props, compute } from "../../tags";
import { set } from "../../operators";

function increment({ state, props }) {
    state.set("count", state.get("count") + (props.by || 1));
}

function decrement({ state, props }) {
    state.set("count", state.get("count") - (props.by || 1));
}

const store = Store(
    {
        state: {
            name: "Redux like",
            count: 0
        },
        signals: {
            increment,
            decrement
        }
    },
    {
        devtools: {
            remoteDebugger: "192.168.0.46:8585"
        }
    }
);

store.connect(
    {
        count: state`count`
    },
    function onCountChanged(props) {
        console.log(`onCountChanged`, props);
    }
);

//store.dispatch(increment);

export default store;

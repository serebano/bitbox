import Store from "../../stores/redux";
import Devtools from "../../Devtools";
import { state, props } from "../../tags";
import { inc, dec } from "../../operators";

export default Store({
    state: {
        name: "Redux like",
        count: 0
    },
    signals: {
        increment: inc(state`count`, props`by`),
        decrement: dec(state`count`, props`by`)
    },
    devtools: Devtools({
        remoteDebugger: "localhost:8585"
    })
});

// import Tag from "./Tag-2";
// //import Model from "./Model";
// import Model from "./Model-2";
import Path from "./Path";
import connect, { Connection } from "./Connect";

//import Listener from "./models/listeners";
import Tree from "./Tree";
import compute, { Compute } from "./paths/compute";

//import Store from "./Store";

// import * as tags from "./tags";
// import * as operators from "./operators";
// import * as models from "./models";

//import "./examples/counter";

// window.fooconn = Path.connect(["foo", "state.*"], function Foo(changes) {
//     console.log(`Foo`, changes);
// });

Object.assign(
    window,
    { compute, connect, Compute, Tree, Connection, Path }
    //tags,
    //operators
);

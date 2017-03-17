import Tag from "./Tag-2";
//import Model from "./Model";
import Model from "./Model-2";
import Path from "./Path";
import Listener from "./models/listeners";
import Tree from "./Tree";

import Store from "./Store";

import * as tags from "./tags";
import * as operators from "./operators";
import * as models from "./models";

//import "./examples/counter";

Path.connect(window, ["foo", "foo.bar"], function Foo(changes) {
    console.log(`Foo`, changes);
});

Object.assign(
    window,
    { Listener, Tree, Path, Tag, Model, Store, tags, operators, models },
    tags,
    operators
);

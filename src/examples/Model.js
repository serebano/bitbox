import Tag from "../Tag";
import Model from "../model";
import { Listeners } from "../models";
import { compute } from "../tags";

function set(api, target, value) {
    return api.select(target).set(value);
}

function inc(api, target, by = 1) {
    function increment(a = 0, b) {
        return a + b;
    }

    return api.select(target).apply(increment, by);
}

function connect(target, listener) {
    return context => {
        const tag = compute(target);
        const conn = context.listeners.connect(
            function Listener(c) {
                conn.update(tag.paths(context));
                listener(tag.get(context));
            },
            tag.paths(context)
        );

        return conn;
    };
}

function Demo(target, api) {
    return new Model(
        target,
        {
            path: "demo",
            onChange: () => api.listeners.flush()
        },
        api
    );
}

function Cars(target, api) {
    return new Model(
        target,
        {
            path: "demo.cars"
        },
        api
    );
}

function Resolve(target, api) {
    function resolve(tag, func) {
        const path = tag.type.split(".");
        const model = Object.assign({}, path.reduce((obj, key) => obj[key], api), {
            path: tag.path(api, true)
        });
        return func ? func(model, api) : model;
    }
    resolve.value = arg => arg instanceof Tag ? arg.get(api) : arg;
    resolve.path = arg => arg instanceof Tag ? arg.path(api) : arg;

    return resolve;
}

function cars(keys, ...values) {
    return new Tag("demo.cars", keys, values);
}

function demo(keys, ...values) {
    return new Tag("demo", keys, values);
}

const app = Model.compose(
    Listeners,
    Demo,
    Cars,
    function Connect(target, api) {
        return function connect(listener, paths) {
            return api.listeners.connect(listener, paths);
        };
    }
    //Resolve
);

const comp = connect(
    {
        foo: demo`foo`,
        bar: demo`bar`,
        cars: cars`**`
    },
    function onFoo(props) {
        console.log(`on-foo`, props);
    }
);

comp(app);

inc(app, demo`foo`);
inc(app, demo`bar`);
set(app, demo`fooCopy`, demo`foo`);
set(app, demo`my.car`, `Toyota`);

set(app, cars`super.ferrari`, "Ferrari");

function concat(api, target, ...args) {
    return api.select(target).apply(
        function concat(arr = [], ...args) {
            return arr.concat(args);
        },
        ...args
    );
}

concat(app, cars`models`, "Volvov");
concat(app, cars`models`, demo`my.car`);

app.select(demo`count`).set(compute(demo`count`, (count = 0) => count + 1));

app.get(demo``, console.info);

window.comp = comp;
window.concat = concat;
window.demo = demo;
window.cars = cars;
window.app = app;
window.Demo = Demo;

export default demo;

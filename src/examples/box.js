function box(value) {
    const object = typeof value === "object" ? value : { value };
    const state = observable(object);
    const listeners = [];

    function boxed(path, value) {
        const keys = path.split(".");
        const type = arguments.length === 2 ? "set" : "get";
        return keys.reduce(
            (obj, key, index, path) => {
                if (index === path.length - 1 && type === "set") return (obj[key] = value);
                if (type === "set" && !(key in obj)) obj[key] = {};
                return obj[key];
            },
            state
        );
    }

    function on(path, fn) {
        listeners.push(fn);
        const keys = path.split(".");

        return observe(function() {
            const value = keys.reduce((obj, key) => obj[key], state);
            fn(value);
        });
    }

    function connect(select, fn) {
        return observe(() => {
            fn(select(state));
        });
    }

    boxed.on = on;
    boxed.connect = connect;

    return boxed;
}

const myBox = box({
    count: 0,
    name: "My Box",
    user: {
        name: "Sereb",
        age: 33
    }
});

myBox.on("count", count => console.log(`my count: ${count}`));
myBox.on("name", name => console.log(`my app name: ${name}`));

myBox.connect(
    state => {
        return {
            name: state.user.name,
            age: state.user.age,
            setName(value) {
                state.user.name = value;
            }
        };
    },
    function User(props) {
        console.log(`User`, props);
        window.uprops = props;
    }
);

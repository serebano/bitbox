import Tag from "../Tag";
import Model from "../model";
import { Listeners } from "../models";
import { compute, props } from "../tags";
import { connect, inc, set, dec } from "../operators";

function cars(keys, ...values) {
    return new Tag("demo.cars", keys, values);
}

function demo(keys, ...values) {
    return new Tag("demo", keys, values);
}

const app = Model.create({
    listeners: Listeners
});

app.create(demo``, {
    getXXX() {
        return this.xxx;
    }
});
app.create(cars``);
app.create(cars`boomboom`);
app.create(demo`xxx`, {
    sayHi() {
        return Object.keys(this);
    }
});

app.on(
    {
        sportCars: cars`sport`,
        foo: demo`foo`
    },
    props => console.log(`on-cars`, props)
);

app(
    set(cars`sport`, props`value`, {
        value: {
            id: "SPOER"
        }
    })
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

app(inc(demo`foo`));
app(inc(demo`bar`));
app(set(demo`fooCopy`, demo`foo`));
app(set(demo`my.car`, `Toyota`));

app(set(cars`super.ferrari`, "Ferrari"));

app.select(demo`count`).apply(
    compute(demo`count`, function INCDEMO(count = 0) {
        return count + 1;
    })
);

window.comp = comp;
window.demo = demo;
window.cars = cars;
window.app = app;

export default demo;

function observe(o, fn) {

    function buildProxy(prefix, o) {
        return new Proxy(o, {
            set(target, property, value) {
                // same as before, but add prefix
                fn(prefix + property, value);
                target[property] = value;
            },
            get(target, property) {
                // return a new proxy if possible, add to prefix
                let out = target[property];
                if (out instanceof Object) {
                    return buildProxy(prefix + property + '.', out);
                }
                return out; // primitive, ignore
            },
        });
    }

    return buildProxy('', o);
}

let x = {
    'model': {
        name: 'Falcon'
    }
};
let p = observe(x, function(property, value) {
    console.info(property, value)
});
p.model.name = 'Commodore';
// model.name Commodore

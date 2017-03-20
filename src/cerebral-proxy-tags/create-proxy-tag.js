import ProxyTag from "./proxy-tag";

const toPrimitive = () => "";

// Used to transfere a ProxyTag from toPrimitive to the "parent" ProxyTag
let objTransfer;

export function addProxySupport(tmplTag) {
    return (strings, ...values) => {
        const tag = tmplTag.apply(tmplTag, [strings].concat(values));
        return new Proxy(tag, {
            get(obj, name) {
                if (name === Symbol.toPrimitive) {
                    objTransfer = obj;
                    return toPrimitive;
                }
                return Reflect.get(obj, name);
            }
        });
    };
}

export function createProxyTag(type, options) {
    options = options || {};
    if (options.hasValue === undefined) {
        options.hasValue = true;
    }
    // Create the root function the proxy is wrapping for the main object
    const rootFunction = () => {
        const f = new ProxyTag();
        f.context = {};
        f.type = type;
        f.options = options;
        f.$$path = [];
        f.$$root = true;
        return f;
    };

    // Create a child function the proxy is wrapping for all supsequent objects
    const childFunction = path => {
        const f = new ProxyTag();
        f.context = {};
        f.type = type;
        f.options = options;
        f.$$path = path;
        return f;
    };

    // Handler of all Proxy object
    const Handler = {
        set(obj, prop, value) {
            // Invoke things on the ProxyTag object
            if (Reflect.has(obj, prop)) {
                obj[prop] = value;
                return true;
                //return Reflect.get(obj, prop);
            }
            console.log(`set`, obj, prop, value);
            obj.set(value);
            //obj[prop] = value;
            return true;
        },
        get(obj, name) {
            // Invoke things on the ProxyTag object
            if (Reflect.has(obj, name)) {
                return Reflect.get(obj, name);
            }

            if (name === Symbol.toStringTag) {
                return "";
            }
            // Always start a new path for a root obj
            if (obj.$$root) {
                obj.$$path = [];
            }
            if (name === Symbol.toPrimitive) {
                objTransfer = obj;
                return toPrimitive;
            }

            if (objTransfer === undefined) {
                // input.a.b normal property access just append
                // remove leading "_" to allow for accessing already
                // defined properties on ProxyTag. Like _options or _type.
                obj.$$path.push(name[0] === "_" ? name.substring(1) : name);
            } else {
                // There is a objTransfer Tag add it.
                obj.$$path.push(objTransfer);
                objTransfer = undefined;
            }
            // Only create a new function when we are on the root object, otherwise just reuse it.
            return new Proxy(obj.$$root ? childFunction(obj.$$path) : obj, Handler);
        }
    };
    return new Proxy(rootFunction(), Handler);
}

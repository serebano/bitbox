import R from "ramda"

const from = R.flip(R.prop)

export default function namedCurry(source_fn, arg_order) {
    function receiver(received_values, n_received, defaults) {
        received_values = (received_values || []).slice()
        n_received = n_received || 0

        Object.keys(defaults).forEach(function(input_arg) {
            var value = defaults[input_arg]
            var required_index = arg_order.indexOf(input_arg)
            var is_known_argument = required_index > -1
            var existing_value = received_values[required_index]

            if (is_known_argument) {
                if (typeof existing_value == "undefined") {
                    n_received++
                }
                received_values[required_index] = value
            }
        })

        if (n_received >= arg_order.length) {
            return source_fn.apply(null, received_values)
        } else {
            return receiver.bind(null, received_values, n_received)
        }
    }

    return receiver.bind(null, null, 0)
}

function thunk(func, arg_names, args_received) {
    return function() {
        var args = [func, arg_names, R.clone(args_received)].concat([].slice.call(arguments))
        return curryNamed.apply(null, args)
    }
}

function curryNamed(func, arg_names, args_received, named) {
    if (typeof args_received == "undefined") return thunk(func, arg_names, {})

    if (R.type(named) == "Object") {
        var valid_args = Object.keys(named).forEach(function(key) {
            //Check if the named argument is a known argument.
            var index = arg_names.indexOf(key)
            if (index > -1) {
                //store the val against the key in our hash
                args_received[key] = named[key]
            }
        })
    } else {
        //find the next positional slot to be filled
        ;[].slice.call(arguments).slice(3).forEach(function(val) {
            var index
            arg_names.some(function(key, i) {
                index = i
                return typeof args_received[key] === "undefined"
            })

            //use the position to find the key
            var key = arg_names[index]

            //store the val against the key in our hash
            if (key) args_received[key] = val
        })
    }

    // if we the same, or more values than were declared in `arg_names` call the func
    if (R.keys(args_received).length >= arg_names.length) {
        return func.apply(null, arg_names.map(from(args_received)))
    } else {
        // otherwise, wait for more values
        return thunk(func, arg_names, args_received)
    }
}

//positional function
// function divide(a, b) {
//     return a / b
// }
//
// divide(10, 2) //=> 5
//
// //named curried version
// var nDivide = curryNamed(divide, ["numerator", "denominator"])
//
// //still works positionally
// nDivide(10, 2) //=> 5
//
// //but you can provide a name if you want
// nDivide({ denominator: 2 })(10) //=> 5
//
// //to be particularly explicit when configuring...
// var half = nDivide({ denominator: 2 })
//
// //this new function will work in the nornal contexts
// //just like R.curry
// R.map(half)([1, 2, 3, 4]) //=> [0.5,1,1.5,2]
//
// //but with one exception
// //If the argument is an object, as in `R.type(val) == "Object"`
// //then you need to reference it by name
// var data = { a: 1, b: 2, c: 3 }
//
// var usesObject = curryNamed(function(models, options) {}, ["models", "options"])
//
// usesObject([1, 2, 3])({ options: data }) //good
// usesObject([1, 2, 3])(data) //bad
//
// // but _technically_ you can still pass in an object literal
// // it just can't be the first argument.
// usesObject([1, 2, 3], data) //works
// usesObject({ models: [1, 2, 3] })(data) //doesn't execute

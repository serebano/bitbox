# bitbox

```js
bitbox( bit: target, box: observer )

const app = bitbox.count(0, console.log)
app.inc = () => app.count++
app.run = () => app.id = setInterval(app.inc, 1000)

bitbox(app => {
    if (app.count >= 10) 
        clearInterval(app.id)
})


// create observable app box
const app = bitbox(observable)

// some helpers
const inc = count => count + 1 // increment operator
const set = (box, value) => obj => bitbox.set(obj, box, value) // setter factory

// target object
const obj = {
	name: 'bitbox',
	count: 0
}

// mapping
const map = bitbox({
	count: app.count,
	name: app.name(name => name.toUpperCase())
})

// connect with target
const props = map(obj)

// observe changes to mapped props
observe(() => console.log(`${props.name} - count(${props.count})`))

// set / classic
app(obj).count++
// use operator
app.count(obj, app.count(inc))


// using handler / set(target, box/path, value)
bitbox.set(obj, app.count, 10)
bitbox.set(obj, app.count, app.count(inc))

// array path
bitbox.set(obj, ['app', 'count'], ['app', 'count', inc])

// factory
set(app.name, `Demo App`) // -> (obj)

// conditional
set(app.name, app.count(n => n > 10 ? `Foo` : `Bar`))

// select...
app(JSON.stringify, console.log, obj)

```

```
yarn start
```

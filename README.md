# bitbox

```js
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
app.count(inc, obj)
// action factory, if no target argument
app.count(inc) // -> (obj)

// using handler / set(target, box/path, value)
bitbox.set(obj, app.count, 10)
bitbox.set(obj, app.count, app.count(inc))
// raw path
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

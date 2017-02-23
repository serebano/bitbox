import Deps from '.'

const foo = new Deps()

function onChange(changes) {
    console.log('onChange', ...changes)
}

foo.add(onChange, {
    bar: true,
    baz: true
})

foo.push('bar')
foo.push('baz')

foo.commit()

import bitbox, { observe, observable } from "../bitbox"

const target = observable({
    count: 0
})

const observer = observe(target, function(target) {
    document.body.innerHTML = `<h1>${target.count}</h1>`

    setTimeout(() => target.count++)
})

import reverse from "./reverse"
import pipePromise from "./pipePromise"

function compose(...fns) {
    return fns.reduce((f, g) => {
        return function composed(...args) {
            return f(g(...args))
        }
    })
}

// const lookupUser = userId => Promise.resolve(db.users[userId])
// const lookupFollowers = user => Promise.resolve(user.followers)
// lookupUser("JOE").then(lookupFollowers)
// const followersForUser = composePromise(lookupFollowers, lookupUser)
// followersForUser("JOE").then(followers => console.log("Followers:", followers))

function composePromise() {
    if (arguments.length === 0) {
        throw new Error("composePromise requires at least one argument")
    }
    return pipePromise.apply(this, reverse(arguments))
}

export default composePromise

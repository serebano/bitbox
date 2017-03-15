import React from 'react'

export default {
    props({state}) {
        return {
            count: state`app.count`,
            color: state`app.color`
        }
    },
    view({count,color}) {
        return (
            <div className="counter">
                <h1 style={{color}}>Count: {count}</h1>
            </div>
        )
    }
}

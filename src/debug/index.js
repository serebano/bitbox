import React from 'react'
import ReactDOM from 'react-dom'
import './style.css'

function App({json,tag}) {
    return (
        <div className="App">
            <div>
                <pre>
                    <code className="javascript">{window.js_beautify(String(tag))}</code>
                </pre>
                <ul>
                    <li>type: <b>{tag.type}</b></li>
                    <li>keys: <ol>{tag.keys?tag.keys.map(k => <li key={'tkey-'+k}><code>{k}</code></li>):''}</ol></li>
                    <li>values: <ol>{tag.values.map(k => <li key={'tval-'+k}><code>{String(k)}</code></li>)}</ol></li>
                </ul>
            </div>
            <pre className="json">{json}</pre>
        </div>
    )
}

export default (props) => ReactDOM.render(<App {...props} />, document.getElementById('root'))

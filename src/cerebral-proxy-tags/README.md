cerebral-proxy-tags [![Build Status](https://travis-ci.org/FWeinb/cerebral-proxy-tags.svg?branch=master)](https://travis-ci.org/FWeinb/cerebral-proxy-tags) [![codecov](https://codecov.io/gh/FWeinb/cerebral-proxy-tags/branch/master/graph/badge.svg)](https://codecov.io/gh/FWeinb/cerebral-proxy-tags)
=========================

In Cerebral v2 tags are a way to target input, state, props or signals. They are
implemented using a new ES2015 feature called [template tags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals).

This module is reimplementing these tags using ES2015 [Proxy Object](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy) to improve the readability
of this feature.

> :warning: Proxy Objects can't be polyfilled in a reasonable way so you can
only use this feature in browser [supporting this](http://caniuse.com/#feat=proxy).

## Getting Started

If you have worked with cerebral v2 you are used to writing tags like:

```js
import {set} from 'cerebral/operators'
import {state} from 'cerebral/tags'

export default [
  set(state`foo.bar`, 'baz')
]
```

Using this library the same functionality would be implemented like this:

```js
import {set} from 'cerebral/operators'
import {state} from 'cerebral-proxy-tags' // <-- import

export default [
  set(state.foo.bar, 'baz') // <-- usage
]
```

## Sample usage

|             cerebral/tags                  |         cerebral-proxy-tags             |
| ------------------------------------------ |:---------------------------------------:|
| ```state`foo.bar.baz` ```                  | `state.foo.bar.baz`                     |
| ```input`items.${props`itemKey`}```        | `input.items[props.itemKey]`            |
| ```state`clients.all.${props`itemKey`}.*```| `state.clients.all[props.itemKey]['*']` |


## Caveat

This module is made possible by wrapping a `Tag` object by a Proxy and intercepting property
access to this `Tag`, building up the final Tag that is used to extract the value/path. But there is a problem with this approach, there are some attributes on a `Tag` that needs to be accessible. These attributes are:

* type
* options
* path
* getTags
* getPath
* getValue
* getNestedTags
* populatePath
* extractValueWithPath

To build a `Tag` that is accessing a path that includes one of these attributes you
need to put a underscore (`_`) in front of it. Some examples:

|             cerebral/tags                  |         cerebral-proxy-tags             |
| ------------------------------------------ |:---------------------------------------:|
| ```state`options.${input`type`}` ```       | `state._options[input._type]`           |
| ```state`foo._bar` ```                     | `state.foo.__bar`                       |

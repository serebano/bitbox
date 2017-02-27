export function getChangedProps(propsA, propsB) {
  const propsAKeys = Object.keys(propsA)
  const propsBKeys = Object.keys(propsB)
  const changedProps = []

  for (let i = 0; i < propsAKeys.length; i++) {
    if (propsA[propsAKeys[i]] !== propsB[propsAKeys[i]]) {
      changedProps.push({path: [propsAKeys[i]]})
    }
  }

  for (let i = 0; i < propsBKeys.length; i++) {
    if (propsA[propsBKeys[i]] !== propsB[propsBKeys[i]]) {
      changedProps.push({path: [propsBKeys[i]]})
    }
  }

  return changedProps
}

export function getProviders (module) {
  return (module.provider ? [module.provider] : []).concat(Object.keys(module.modules || {})
    .reduce((nestedProviders, moduleKey) => {
      return nestedProviders.concat(getProviders(module.modules[moduleKey]))
    }, [])
  )
}

export function Context(providers, ...args) {
	providers.reduce((context, Provider) => {
		return Provider(context, ...args)
	}, this)
}


export function ensureStrictPath(path, value) {
    if (isComplexObject(value) && path.indexOf('*') === -1) {
        return `${path}.**`
    }

    return path
}

export function absolutePath(target, context) {
	return target.type + "." + target.path(context)
}

export function extractFrom(target, path) {
	if (!target)
		throw new Error(`Invalid target, extracting with path: ${path}`)

	const keys = !Array.isArray(path)
		? path.split('.')
		: path

	return keys.reduce((result, key, index) => {
		if (index > 0 && result === undefined) {
			console.log(`target`, target, key, index, result)
			throw new Error(`A tag is extracting with path "${path}/${key}[${index}]", but it is not valid`)
		}
		return key === "" || key === "*" || key === "**" ? result : result[key]
	}, target)
}

export function ensurePath(path = []) {
    if (Array.isArray(path)) {
        return path
    } else if (typeof path === 'string') {
        return path.split('.')
    }

    return []
}

export function isValidResult(result) {
  return (
    !result ||
    (
      typeof result === 'object' &&
      !Array.isArray(result)
    )
  )
}

export function isPromise (result) {
    return result && typeof result.then === 'function' && typeof result.catch === 'function'
}

export function cleanPath(path) {
    return path.indexOf('*') > -1
        ? path.replace(/\.\*\*|\.\*/, '')
        : path
}

export function isObject(obj) {
    return typeof obj === 'object' && obj !== null && !Array.isArray(obj)
}

export function isComplexObject(obj) {
    return typeof obj === 'object' && obj !== null
}

function extractAllChildMatches(children) {
    return Object.keys(children).reduce((matches, key) => {
        if (children[key].children) {
            return matches.concat(children[key]).concat(extractAllChildMatches(children[key].children))
        }

        return matches.concat(children[key])
    }, [])
}

export function dependencyMatch(changes, dependencyMap) {
    let currentMatches = []

    for (let changeIndex = 0; changeIndex < changes.length; changeIndex++) {
        let currentDependencyMapLevel = dependencyMap
        for (let pathKeyIndex = 0; pathKeyIndex < changes[changeIndex].path.length; pathKeyIndex++) {
            if (!currentDependencyMapLevel) {
                break
            }

            if (currentDependencyMapLevel['**']) {
                currentMatches.push(currentDependencyMapLevel['**'])
            }

            if (pathKeyIndex === changes[changeIndex].path.length - 1) {
                const dependency = currentDependencyMapLevel[changes[changeIndex].path[pathKeyIndex]]
                if (dependency) {
                    currentMatches.push(dependency)

                    if (dependency.children) {
                        if (changes[changeIndex].forceChildPathUpdates) {
                            currentMatches = currentMatches.concat(extractAllChildMatches(dependency.children))
                        } else {
                            if (dependency.children['**']) {
                                currentMatches.push(dependency.children['**'])
                            }

                            if (dependency.children['*']) {
                                currentMatches.push(dependency.children['*'])
                            }
                        }
                    }
                }

                if (currentDependencyMapLevel['*']) {
                    currentMatches.push(currentDependencyMapLevel['*'])
                }
            }

            if (!currentDependencyMapLevel[changes[changeIndex].path[pathKeyIndex]]) {
                currentDependencyMapLevel = null
                break
            }

            currentDependencyMapLevel = currentDependencyMapLevel[changes[changeIndex].path[pathKeyIndex]].children
        }
    }

    return currentMatches
}

export function Cache() {
    const _index = {}

    return {
        keys(type) {
            return _index[type] && Object.keys(_index[type])
        },
        has(type, path) {
            return _index[type] && (path in _index[type][path])
        },
        get(type, path) {
            return _index[type] && _index[type][path]
        },
        set(type, path, value) {
            if (!_index[type])
                _index[type] = {}

            _index[type][path] = value
        },
        delete(type, path) {
            return _index[type] && (delete _index[type][path])
        },
        clear(type) {
            return delete _index[type]
        }
    }
}

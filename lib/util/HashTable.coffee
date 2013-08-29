_ = require 'underscore'

# Key value pair setup that attemps to hash the key we have. This works out of
# the box for built in types, and relies on an object implementing toHash that
# returns a value that will be coerced to a string to serve as the key value in
# the hash
module.exports = class HashTable

  constructor: (hash) ->
    # hashed key -> (key, value)
    @_map = {}
    for k, v of hash
      @add k, v

  @hash: (k) ->
    return ''+k unless _.isObject k
    return hash if hash = k?.toHash?()
    throw new Error 'Key must be native type or implement #toHash()'

  add: (k, v) -> @_map[HashTable.hash k] = key: k, value: v

  clear: (k, v) -> @_map = {}

  remove: (k) -> delete @_map[HashTable.hash k]

  containsKey: (key) -> HashTable.hash(key) of @_map

  get: (key) -> @_map[HashTable.hash key]?.value

  count: -> (k for k of @_map).length

  each: (f) ->
    f entry.key, entry.value for hkey, entry of @_map
    return

  keys: -> entry.key for hkey, entry of @_map

  items: -> entry.value for hkey, entry of @_map


_          = require 'underscore'
Base       = require '../util/Base.coffee'
Observable = require '../observable/Observable.coffee'
HashTable  = require '../util/HashTable.coffee'

# An evented dictionary designed to be used as an ad-hoc key/value container,
# uses HashTable to keep track of everything
module.exports = class ObservableDictionary extends Base
  @uses Observable

  constructor: (hash) ->
    super
    @_ht = new HashTable hash

  # Insert key value pair into the dict
  add: (key, item) ->
    return this if @containsKey(key) and @get(key) is item
    @_ht.add key, item
    @trigger Observable.ADD, key: key, value: item
    @trigger "#{Observable.ADD}:#{key}", item

    # Proxy events if we can
    @listenTo item, Observable.CHANGE, -> @trigger Observable.CHANGE, item

    @trigger Observable.CHANGE
    return this

  # Remove all items, triggers a clear event. does NOT triggere a remove event
  # for all objects
  clear: ->
    return this unless @count()
    @stopListening
    @_ht.clear()
    @trigger Observable.CLEAR
    @trigger Observable.CHANGE
    return this

  # Delete a specific key and make sure to fire an event off
  remove: (key) ->
    return this unless @containsKey key
    item = @get item
    @_ht.remove key
    @trigger "#{Observable.REMOVE}:#{key}", item
    @trigger Observable.REMOVE, key: key, value: item
    @trigger Observable.CHANGE
    return this

  # Ensure we have a key
  containsKey: (key) -> @_ht.containsKey key

  # Fetch by key
  get: (key) -> @_ht.get key

  # Total number of keys
  count: -> @_ht.count()

  # noss
  @property length: get: -> @count()

  # Iterate over keys and vals
  each: (f) -> @_ht.each f



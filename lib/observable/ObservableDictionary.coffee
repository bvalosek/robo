_                 = require 'underscore'
Base              = require '../util/Base.coffee'
WithObsProperties = require '../observable/WithObservableProperties.coffee'
HashTable         = require '../util/HashTable.coffee'

# An evented dictionary designed to be used as an ad-hoc key/value container,
# uses HashTable to keep track of everything
module.exports = class ObservableDictionary extends Base
  @uses WithObsProperties

  constructor: (hash) ->
    super
    @_ht = new HashTable hash

  # Insert key value pair into the dict
  add: (key, item) ->
    return this if @containsKey(key) and @get(key) is item
    @_ht.add key, item
    @trigger 'add', key: key, value: item
    @trigger "add:#{key}", item

    # Proxy events if we can
    @listenTo item, 'change', -> @trigger 'change', item

    @trigger 'change'
    return this

  # Remove all items, triggers a clear event. does NOT triggere a remove event
  # for all objects
  clear: ->
    return this unless @count()
    @stopListening
    @_ht.clear()
    @trigger 'clear'
    @trigger 'change'
    return this

  # Delete a specific key and make sure to fire an event off
  remove: (key) ->
    return this unless @containsKey key
    item = @get item
    @_ht.remove key
    @trigger "remove:#{key}", item
    @trigger 'remove', key: key, value: item
    @trigger 'change'
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



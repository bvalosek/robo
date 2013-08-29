_                 = require 'underscore'
Base              = require '../util/Base.coffee'
WithObsProperties = require '../observable/WithObservableProperties.coffee'

# An evented dictionary designed to be used as an ad-hoc key/value container
module.exports = class ObservableDictionary extends Base
  @uses WithObsProperties

  constructor: (hash) ->
    super
    @_dict = if _.isObject hash then hash else {}

  # Insert key value pair into the dict
  add: (key, item) ->
    return this if @containsKey(key) and @get(key) is item
    @_dict[key] = item
    @trigger 'add', key: key, value: item
    @trigger "add:#{key}", item

    # Proxy events if we can
    @listenTo item, 'change', -> @trigger 'change', item

    @trigger 'change'
    return this

  # Remove all items, triggers a clear event. does NOT triggere a remove event
  # for all objects
  clear: ->
    return this if _.isEmpty @_dict
    @stopListening
    @_dict = {}
    @trigger 'clear'
    @trigger 'change'
    return this

  # Delete a specific key and make sure to fire an event off
  remove: (key) ->
    return this unless @containsKey key
    item = @get key
    delete @_dict[key]
    @trigger "remove:#{key}", item
    @trigger 'remove', key: key, value: item
    @trigger 'change'
    return this

  # Ensure we have a key
  containsKey: (key) -> key of @_dict

  # Fetch by key
  get: (key) -> @_dict[key]

  # Total number of keys
  count: -> _.size @_dict

  # noss
  @property length: get: -> @count()

  # Iterate over keys and vals
  each: (f) -> _.each @_dict



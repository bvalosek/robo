Base              = require '../util/Base.coffee'
WithObsProperties = require '../observable/WithObservableProperties.coffee'

# An arbitrary, evented, observable collection of (typically, but not always)
# observable objects. Is enumerable and list-like
module.exports = class ObservableList extends Base
  @uses WithObsProperties

  constructor: ->
    super
    @_items = []

  # Add new item to the collection. Will push it onto the stack, listen for
  # changes to rebroadcast, and fire off change events
  add: (item) ->
    @_items.push item
    @trigger 'add', item

    # Proxy events if we can
    @listenTo item, 'change', -> @trigger 'change', item

    @trigger 'change'
    return this

  # Remove all items, triggers a clear event. does NOT triggere a remove event
  # for all objects
  clear: ->
    @stopListening()
    @_items = []
    @trigger 'clear'

    @trigger 'change'
    return this

  # Given an index, remove an item and fire off events
  removeAt: (index) ->
    obj = @_items[index]
    @trigger 'remove', obj
    @_items.splice index, 1
    @stopListening obj

    @trigger 'change'
    return this

  # Remove the first instance of a particular item
  remove: (item) -> @removeAt @_items.indexOf item

  # Item at specific index
  get: (index) -> @_items[index]

  # Index of an item
  indexOf: (item) -> @_items.indexOf item

  # Total number of items
  count: -> @_items.length

  # Execute iterator for each item in the list
  each: (f) ->
    f x for x in @_items
    return

  # Return an array mapping items by a mutator function
  map: (f) -> f x for x in @_items


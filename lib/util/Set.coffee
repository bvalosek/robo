Hashtable = require './Hashtable.coffee'

# Collection of hashable objects in which there are no duplicates. Multiple
# adds are effectively nops. Implemented with a Hashtable by just using the
# keys as the items. Order is not preserved
module.exports = class Set

  constructor: (items) ->
    @_ht = new Hashtable items

  add: (item) -> @_ht.add item

  clear: (item) -> @_ht.clear()

  remove: (item) -> @_ht.remove item

  contains: (item) -> @_ht.containsKey item

  count: -> @_ht.count()

  each: (f) -> @_ht.each f

  items: -> @_ht.keys()

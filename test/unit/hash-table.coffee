HashTable = require 'robo/util/HashTable'
_         = require 'underscore'

QUnit.module 'HashTable'

test 'Add and get native types', ->
  h = new HashTable

  h.add 'a', 1
  h.add 2, 'two'
  h.add false, 3
  h.add 1.5, 'four'

  strictEqual h.get('a'), 1, 'check'
  strictEqual h.get(2), 'two', 'check'
  strictEqual h.get(false), 3, 'check'
  strictEqual h.get(1.5), 'four', 'check'
  strictEqual h.get('not there'), undefined, 'check'

test 'Throw error on unhashable key', ->
  h = new HashTable

  obj =
    prop: 123
    toHash: -> @prop

  throws -> h.add prop: 123, 'value'
  h.add obj, 'obj value' # doesnt throw

test 'Removes and count', ->
  h = new HashTable

  strictEqual h.count(), 0, 'init'
  h.add 1,1
  strictEqual h.count(), 1, 'added'
  h.add 2,1
  strictEqual h.count(), 2, 'added'
  h.remove 1
  strictEqual h.count(), 1, 'removed'
  h.remove 'not there'
  strictEqual h.count(), 1, 'nothing removed'
  h.remove 2
  strictEqual h.count(), 0, 'removed'

test 'keys() and items()', ->
  h = new HashTable
  obj = prop: 123, toHash: -> @prop

  h.add 1, 1
  h.add 'two', 2
  h.add false, 3
  h.add obj, 4

  console.log h.keys()

  # should really be array comparassion irrespective of order...
  strictEqual h.keys().length, 4, 'keys()'
  strictEqual h.items().length, 4, 'items()'

test 'containsKey()', ->
  h   = new HashTable
  obj = prop: 123, toHash: -> @prop

  h.add 1, 1
  h.add 'two', 2
  h.add false, 3
  h.add obj, 4

  ok h.containsKey(1), '1'
  ok h.containsKey('two'), '2'
  ok h.containsKey(false), '3'
  ok h.containsKey(obj), '4'

  h.remove obj
  ok not h.containsKey(obj), 'not 4'


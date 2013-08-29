ObservableDictionary = require 'robo/observable/ObservableDictionary'
ObservableObject     = require 'robo/observable/ObservableObject'

QUnit.module 'ObservableDictionary'

test 'Basic dictionary', ->
  d = new ObservableDictionary prop: 123

  strictEqual d.get('prop'), 123, 'get init value'
  d.add 'key', 456
  strictEqual d.get('key'), 456, 'get added value'
  d.remove 'key'
  strictEqual d.containsKey('key'), false, 'remove works'
  strictEqual d.count(), 1, 'count'
  strictEqual d.count(), d.length, 'count'

  d.clear()
  strictEqual d.length, 0, 'clear works'

test 'Add and remove events', ->
  d = new ObservableDictionary

  add = addProp = remove = removeProp = change = 0

  d.on 'change', -> change++
  d.on 'add', -> add++
  d.on 'add:prop', -> addProp++
  d.on 'remove', -> remove++
  d.on 'remove:prop', -> removeProp++

  d.add 'prop', 123
  d.add 'prop', 123 # nop
  d.remove 'prop'
  d.remove 'prop' # nop

  ok add is addProp is remove is removeProp is 1, 'add and remove events firing'
  strictEqual change, 2, 'change fired both'

test 'Event on clear', 1, ->
  d = new ObservableDictionary

  d.on 'clear', -> ok true, 'clear fired'

  d.clear() # nop
  d.add 'k', 'v'
  d.clear()
  d.clear() #nop




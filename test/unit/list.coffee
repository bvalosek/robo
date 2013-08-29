ObservableList   = require 'robo/observable/ObservableList'
ObservableObject = require 'robo/observable/ObservableObject'

QUnit.module 'ObservableList'

test 'Basic list', 7, ->
  class Obv extends ObservableObject
    @observable x: 123

  a    = new Obv
  list = new ObservableList

  list.on 'change', -> ok true, 'change fired'
  strictEqual list.count(), 0, 'empty to start'
  list.add a
  strictEqual list.count(), 1, '1 after'
  strictEqual list.count(), list.length, 'length property'
  a.x = 111
  list.remove a
  strictEqual list.count(), 0, '0 after remove'
  a.x = 222

test 'Add and Remove events', ->
  class Obv extends ObservableObject
    @observable x: 111
    @observable y: 222

  change       = 0
  add          = 0
  remove       = 0
  lengthChange = 0

  list = new ObservableList
  list.on 'change', -> change++
  list.on 'add', -> add++
  list.on 'remove', -> remove++
  a = new Obv
  b = new Obv

  list.add a
  list.add b
  strictEqual change, 2, 'change events'
  strictEqual add, 2, 'add events'

  list.remove a
  strictEqual remove, 1, 'remove events'
  strictEqual add, 2, 'add events'
  strictEqual change, 3, 'change events'

  a.x = 555 # nop
  b.x = 555
  strictEqual change, 4, 'change events'

  list.remove b
  strictEqual remove, 2, 'remove events'
  strictEqual add, 2, 'add events'
  strictEqual change, 5, 'change events'

test 'Change events w/ args passed', ->
  class Obv extends ObservableObject
    @observable x: 111
    @observable y: 222

  list = new ObservableList
  a = new Obv
  list.on 'add', (item) -> strictEqual item, a, 'add item passed'
  list.on 'remove', (item) -> strictEqual item, a, 'remove item passed'

  list.add a
  list.remove a

test 'ObservableObject with list property', ->
  class Obv extends ObservableObject
    @observable x: undefined

  parent  = new Obv
  list    = new ObservableList
  a       = new Obv

  pChange = 0
  lChange = 0
  list.on 'change', -> lChange++
  parent.on 'change', -> pChange++

  parent.x = list
  strictEqual pChange, 1, 'parent changes'
  strictEqual lChange, 0, 'list changes'

  list.add a
  strictEqual pChange, 2, 'parent changes'
  strictEqual lChange, 1, 'list changes'

  a.x = 123
  strictEqual pChange, 3, 'parent changes'
  strictEqual lChange, 2, 'list changes'

  list.remove a
  strictEqual pChange, 4, 'parent changes'
  strictEqual lChange, 3, 'list changes'

  a.x = 456
  strictEqual pChange, 4, 'parent changes'
  strictEqual lChange, 3, 'list changes'

  list.add 789
  strictEqual pChange, 5, 'parent changes'
  strictEqual lChange, 4, 'list changes'

  parent.x = null
  strictEqual pChange, 6, 'parent changes'
  strictEqual lChange, 4, 'list changes'

  list.add 'awesome'
  strictEqual pChange, 6, 'parent changes'
  strictEqual lChange, 5, 'list changes'

test 'Removing all items', ->
  list = new ObservableList

  list.add 1
  list.add 2
  list.add 2

  list.removeAll 2
  strictEqual list.count(), 1, 'Removed bolth'


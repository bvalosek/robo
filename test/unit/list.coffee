ObservableList   = require 'robo/observable/ObservableList'
ObservableObject = require 'robo/observable/ObservableObject'

QUnit.module 'ObservableList'

test 'Basic list', 6, ->
  class Obv extends ObservableObject
    @observable x: 123

  a    = new Obv
  list = new ObservableList

  list.on 'change', -> ok true, 'change fired'
  strictEqual list.count(), 0, 'empty to start'
  list.add a
  strictEqual list.count(), 1, '1 after'
  a.x = 111
  list.remove a
  strictEqual list.count(), 0, '0 after remove'
  a.x = 222

test 'add remove events', ->
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

test 'change events w/ args passed', ->
  class Obv extends ObservableObject
    @observable x: 111
    @observable y: 222

  list = new ObservableList
  a = new Obv
  list.on 'add', (item) -> strictEqual item, a, 'add item passed'
  list.on 'remove', (item) -> strictEqual item, a, 'remove item passed'

  list.add a
  list.remove a




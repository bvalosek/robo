ObservableObject = require '../../lib/observable/ObservableObject.coffee'

QUnit.module 'ObservableObject'

test 'Simple change triggers', 4, ->
  class O extends ObservableObject
    constructor: ->
      super

    @observable prop: 123

  global.t = new O

  o = new O
  o.onChange -> ok true, 'change event triggered'
  strictEqual o.prop, 123, 'initial value'

  o.prop = 234
  o.prop = 234 # nop
  o.prop = null
  o.prop = null # nop
  o.prop = undefined
  o.prop = undefined # nop

test 'specific prop change', 1, ->
  class O extends ObservableObject
    @observable
      foo: 111
      bar: 222

  o = new O
  o.onPropertyChange 'foo', -> ok true, 'foo changed'
  o.foo = 444
  o.foo = 444 #nop
  o.bar = 444 #nop

test 'observable observable', 4, ->
  class O extends ObservableObject
    @observable
      foo: 111
      bar: 222

  o = new O
  p = new O

  o.onPropertyChange 'foo', -> ok true, 'foo changed'

  o.foo = p
  p.foo = 333
  p.bar = 345
  o.bar = 444 # nop
  o.foo = null
  p.foo = 555 # nop
  p.bar = 666 # nop

test 'computed basics', 3, ->

  class O extends ObservableObject
    @observable
      firstName: 'John'
      lastName: 'Doe'
      name: -> "#{@firstName} #{@lastName}"

  o = new O
  o.onPropertyChange 'name', -> ok true, 'name changed'
  strictEqual o.name, 'John Doe', 'basic access with default observables'
  o.firstName = 'Bob'
  strictEqual o.name, 'Bob Doe', 'basic access with mutated observables'


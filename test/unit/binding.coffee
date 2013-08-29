Binding          = require '../../lib/observable/Binding.coffee'
ObservableObject = require '../../lib/observable/ObservableObject.coffee'

QUnit.module 'Binding'

test 'Setting source to static', 4, ->
  b = new Binding
  b.on Binding.SOURCE_CHANGE, -> ok true, 'source changed'

  b.setSource 123
  strictEqual b.value, 123, 'static set'
  b.setSource 456
  strictEqual b.value, 456, 'static set'
  b.setSource 456 # nop

test 'Setting value directly', 4, ->
  b = new Binding
  b.on Binding.SOURCE_CHANGE, -> ok true, 'source changed'

  b.value = 123
  strictEqual b.value, 123, 'static set'
  b.value = 456
  strictEqual b.value, 456, 'static set'
  b.value = 456 # nop

test 'Setting ObservableObject as source', 4, ->
  class Obv extends ObservableObject
    @observable prop: 123

  o = new Obv
  b = new Binding
  b.on Binding.SOURCE_CHANGE, -> ok true, 'source changed'

  b.setSource o, 'prop'
  o.prop = 456
  o.prop = 456 # nop
  o.prop = null
  b.setSource 1234
  o.prop = 456 # nop

test 'Setting target', ->
  class Obv extends ObservableObject
    @observable prop: 123

    o = new Obv
    p = foo:  456
    b = new Binding()
      .setSource(o, 'prop')
      .setTarget(p, 'foo')

    strictEqual p.foo, 123, 'init value'
    o.prop = 555
    strictEqual p.foo, 555, 'changed via source'
    b.value = 666
    strictEqual p.foo, 666, 'changed via binding value'

    x = new Obv
    y = new Obv
    x.prop = 10
    y.prop = 20
    binding = new Binding()
      .setSource(x, 'prop')
      .setTarget(y, 'prop')

    strictEqual y.prop, 10, 'target set up'
    x.prop = 15
    strictEqual y.prop, 15, 'target changed'

test 'Changing source', 5, ->
  class Obv extends ObservableObject
    @observable prop: 123

  a = new Obv
  b = new Obv
  t = prop: undefined
  b.prop = 456

  binding = new Binding()
    .setSource(a, 'prop')
    .setTarget(t, 'prop')
  binding.on Binding.SOURCE_CHANGE, -> ok true, 'source changed'

  strictEqual t.prop, 123, 'init'
  binding.setSource b, 'prop'
  strictEqual t.prop, 456, 'target changed on source change'
  a.prop = 'nope' # nop
  binding.setSource 'static'
  strictEqual t.prop, 'static', 'source back to static works'

test 'Two way binding and target removal', ->
  class Obv extends ObservableObject
    @observable prop: 123

  a = new Obv
  b = new Obv
  c = new Obv

  binding = new Binding()
    .setSource(a, 'prop')
    .setTarget(b, 'prop')

  strictEqual a.prop, 123, 'init'
  strictEqual b.prop, 123, 'init'
  b.prop = 1
  strictEqual a.prop, 1, 'target changed source'
  a.prop = 2
  strictEqual b.prop, 2, 'source changed target'

  binding.setTarget c, 'prop'
  strictEqual c.prop, 2, 'c init'
  binding.removeTarget b
  a.prop = 3
  strictEqual b.prop, 2, 'source doesnt change target after removal'
  strictEqual c.prop, 3, 'source change still affects bound targets'
  b.prop = 4
  strictEqual a.prop, 3, 'target doesnt change source after removal'

test 'Dot-notation properties', ->
  class Child extends ObservableObject
    @observable prop: 123

  class Parent extends ObservableObject
    @observable child: null

    constructor: ->
      super
      @child = new Child

  a = new Parent
  t = {val: undefined}

  binding = new Binding()
    .setSource(a, 'child.prop')
    .setTarget(t, 'val')

  strictEqual t.val, 123, 'init val'
  a.child.prop = 456
  strictEqual t.val, 456, 'change val'



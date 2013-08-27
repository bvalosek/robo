Binding          = require '../../lib/observable/Binding.coffee'
ObservableObject = require '../../lib/observable/ObservableObject.coffee'

QUnit.module 'Binding'

test 'Setting source to static', 4, ->
  b = new Binding
  b.on Binding.SOURCE_CHANGED, -> ok true, 'source changed'

  b.setSource 123
  strictEqual b.value, 123, 'static set'
  b.setSource 456
  strictEqual b.value, 456, 'static set'
  b.setSource 456 # nop

test 'Setting value directly', 4, ->
  b = new Binding
  b.on Binding.SOURCE_CHANGED, -> ok true, 'source changed'

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
  b.on Binding.SOURCE_CHANGED, -> ok true, 'source changed'

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


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

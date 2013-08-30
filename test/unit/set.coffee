Set = require 'robo/util/Set'

QUnit.module 'Set'

test 'Add and removes', ->
  s = new Set

  s.add 1
  strictEqual s.contains(1), true, 'Basic add'
  s.add 2
  strictEqual s.contains(2), true, 'subsequent add'
  s.add 3
  strictEqual s.contains(4), false, 'false contains'
  strictEqual s.count(), 3, 'count'
  s.add 3
  s.add 3
  s.add 3
  strictEqual s.count(), 3, 'count after nop adds'
  s.remove 3
  strictEqual s.count(), 2, 'count after remove'
  s.remove 9
  strictEqual s.count(), 2, 'count after remove nop'



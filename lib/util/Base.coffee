# Add in the cool static functionality used throughout robo
module.exports = class Base

  # Copy an one or more classes' methods into our prototype. Likewise for
  # statics
  @uses: (mixins...) ->
    for mixin in mixins

      for key, value of mixin.prototype when key isnt 'constructor'
        @::[key] = value

      @[key] = value for key, value of mixin

    return

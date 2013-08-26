# Add in the cool static functionality used throughout robo
module.exports = class Base

  # Copy an one or more classes' methods into our prototype. Likewise for
  # statics
  @uses: (mixins...) ->
    for mixin in mixins
      @::[key] = value for key, value of mixin::
      @[key] = value for key, value of mixin
    return

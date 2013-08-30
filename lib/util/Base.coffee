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

  # Easily setup getters and setters
  @property: (hash) ->
    for key, info of hash
      Object.defineProperty @::, key,
        enumerable: true
        configurable: true
        get: info.get
        set: info.set
    return

  # Designate a particular property to set as the content property, used during
  # declarative definitions of objects
  @content: (hash) ->
    @.CONTENT_PROP = key for key of hash # should only be one

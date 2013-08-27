WithObservableProperties = require './WithObservableProperties.coffee'
WithEvents               = require '../event/WithEvents.coffee'
Base                     = require '../util/Base.coffee'

# A class that is used to connect a binding Target (such as a UI element) to a
# binding Source (an object that implements WithObservableProperties)
module.exports = class Binding extends Base
  @uses WithEvents

  @SOURCE_CHANGED: 'bindingSourceChanged'

  @TARGET_CHANGED: 'bindingTargetChanged'

  constructor: ->
    @source        = null
    @property      = null
    @twoWay        = true
    @valueWhenNull = null

  # Bind to a target property. Multiple targets could be bound potentially.  If
  #tthe target is an ObservableObject, assume we can listen for change events
  setTarget: (target, prop) ->
    return this unless target?

    # Start off setting the target and setup event for future changes on this
    # binding
    target[prop] = @value
    @on Binding.SOURCE_CHANGED, -> target[prop] = @value
    return this

  setSource: (source, prop) ->
    return this if source is @source and prop is @prop
    @stopListening if @source

    if prop?
      @source = source
      @prop   = prop
      @listenTo source, "change:#{prop}", -> @trigger Binding.SOURCE_CHANGED

    else
      @source = @prop = null
      return this if @valueWhenNull is source
      @valueWhenNull = source

    @trigger Binding.SOURCE_CHANGED
    return this

  # Get access to the source directly
  @property value:

    get: ->
      if @source? and @property? source[property] else @valueWhenNull

    set: (v) ->
      if @source? and @property?
        source[property] = v
      else if @valueWhenNull isnt v
        @valueWhenNull = v
        @trigger Binding.SOURCE_CHANGED





WithEvents = require '../event/WithEvents.coffee'
Base       = require '../util/Base.coffee'
Observable = require './Observable.coffee'

# A class that is used to connect a binding Target (such as a UI element) to a
# binding Source (an object that implements WithObservableProperties)
module.exports = class Binding extends Base
  @uses WithEvents

  @SOURCE_CHANGE : 'bindingSourceChange'

  @TARGET_CHANGE : 'bindingTargetChange'

  @ONE_WAY       : 'bindingOneWay'

  @TWO_WAY       : 'bindingTwoWay'

  constructor: ->
    @source        = null
    @property      = null
    @valueWhenNull = null
    @mode          = Binding.TWO_WAY

  # Bind to a target property. Multiple targets could be bound potentially.  If
  #tthe target is an ObservableObject, assume we can listen for change events
  setTarget: (target, prop, mode = @mode) ->
    return this unless target?

    # Start off setting the target and setup event for future changes on this
    # binding, making sure to bind to the target's context to ensure we can
    # unbind later
    target[prop] = @value
    @on Binding.SOURCE_CHANGE, (=> target[prop] = @value), target

    # Two way binding
    if mode is Binding.TWO_WAY
      @listenTo target, "#{Observable.CHANGE}:#{prop}", (v) ->
        @value = target[prop]

    return this

  # Unbind events associated with updating the target. Target's value won't
  # change, but future changes in source will not affect it
  removeTarget: (target) ->
    @off Binding.SOURCE_CHANGE, null, target
    @stopListening target
    return this

  setSource: (source, prop) ->
    return this if source is @source and prop is @prop
    @stopListening() if @source

    if prop?
      @source   = source
      @property = prop
      @listenTo source, "change:#{prop}", -> @trigger Binding.SOURCE_CHANGE

    else
      @source = @property = null
      return this if @valueWhenNull is source
      @valueWhenNull = source

    @trigger Binding.SOURCE_CHANGE
    return this

  # Needs to be Binding.TWO_WAY or Binding.ONE_WAY
  setMode: (m) ->
    @mode = m
    return this

  # Get access to the source directly
  @property value:
    get: ->
      if @source? and @property? then @source[@property] else @valueWhenNull
    set: (v) ->
      if @source? and @property?
        @source[@property] = v
      else if @valueWhenNull isnt v
        @valueWhenNull = v
        @trigger Binding.SOURCE_CHANGE


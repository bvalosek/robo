_                        = require 'underscore'
Base                     = require '../util/Base.coffee'
WithObservableProperties = require \
  '../observable/WithObservableProperties.coffee'

# An object that has get, set and observable properties via the OBSERVABLE
# decoration. Serves as the base of anything we want to have dependencies and
# observable properties
module.exports = class ObservableObject extends Base
  @uses WithObservableProperties

  constructor: (props) ->
    @__frames = []
    @__deps = {}

  # Allows use to use the @observable decoration
  @observable: (hash) ->
    for prop, val of hash
      do (prop, obj = @::, val) ->
        _prop = '_' + prop

        # Create the private member, either normal val or getter/setter if
        # computed
        if _(val).isFunction()
          Object.defineProperty obj, _prop,
            enumerable: true
            configurable: true
            get: -> @_getComputedValue prop, val
        else
          obj[_prop] = val

        # Setup actual getters and setters to the private member
        Object.defineProperty obj, prop,
          enumerable: true
          configurable: true
          get: -> @getProperty prop
          set: (v) -> @setProperty prop, v

  # Run a member function while tracking all dependencies
  _getComputedValue: (prop, fn) ->
    frame = []

    # Fill a frame with all the accessed values and record them as dependencies
    # for this property
    @__frames.push frame
    val = fn.call this
    @__frames.pop()
    @__deps[prop] = frame

    return val

  # Mark access to a property
  _trackAccess: (prop) ->
    if @__frames.length
      @__frames[@__frames.length - 1].push prop

  _expandDependencies: (prop) ->
    return [prop] unless @__deps[prop]

    r = [prop]
    for x in @__deps[prop]
      r = r.concat x

    return r

  # Change an observable property and trigger change events for it, as well as
  # any other dependent properties
  setProperty: (prop, val) ->
    @_trackAccess prop

    _prop = '_' + prop
    oldValue = @[_prop]
    return if val is oldValue

    # Stop listening to the old one and proxy up a property change if our new
    # one does so
    @stopListening oldValue, 'change'
    @listenTo val, 'change', =>
      @triggerPropertyChange prop

    @[_prop] = val
    @triggerPropertySet prop
    @triggerPropertyChange prop

    # Find anything that depends on this property, set it as well
    for p, deps of @__deps
      @triggerPropertyChange p if prop in @_expandDependencies p

  # Access a property value and track it in the case of watching dependents
  getProperty: (prop) ->
    @_trackAccess prop
    @['_' + prop]


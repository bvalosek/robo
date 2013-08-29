Base       = require '../util/Base.coffee'
Observable = require '../observable/Observable.coffee'
_          = require 'underscore'

# An object that has get, set and observable properties via the OBSERVABLE
# decoration. Serves as the base of anything we want to have dependencies and
# observable properties
module.exports = class ObservableObject extends Base
  @uses Observable

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

    # Fill a frame with all the accessed values and record them as dependencies
    # for this property
    @__frames.push []
    val = fn.call this
    @__deps[prop] = @__frames.pop()
    return val

  # Mark access to a property
  _trackAccess: (prop) ->
    @__frames[@__frames.length - 1].push prop if @__frames.length
    return

  _getDependencies: (prop) ->
    return [prop] unless @__deps[prop]
    ret = []
    ret = ret.concat @_getDependencies p for p in @__deps[prop]
    return ret

  _expandDependencies: (deps) ->
    ret = []
    ret = ret.concat @_getDependencies d for d in deps
    return ret

  # Fire off any change events for properties that depend on prop
  _triggerDependencies: (prop) ->
    for p, deps of @__deps
      @triggerPropertyChange p if prop in @_expandDependencies deps
    return

  # Change an observable property and trigger change events for it, as well as
  # any other dependent properties
  setProperty: (prop, val) ->
    @_trackAccess prop
    _prop = '_' + prop
    oldValue = @[_prop]
    return if val is oldValue

    # Stop listening to the old one and proxy up a property change if our new
    # one does so
    @stopListening oldValue, Observable.CHANGE
    @listenTo val, Observable.CHANGE, => @triggerPropertyChange prop

    @[_prop] = val
    @triggerPropertySet prop
    @triggerPropertyChange prop

    # Need to trigger change notifications for any dependent properties
    @_triggerDependencies prop

  # Access a property value and track it in the case of watching dependents
  getProperty: (prop) ->
    @_trackAccess prop
    @['_' + prop]


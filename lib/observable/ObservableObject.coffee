Base                     = require '../util/Base.coffee'
WithObservableProperties = require '../observable/WithObservableProperties.coffee'

# An object that has get, set and observable properties via the OBSERVABLE
# decoration. Serves as the base of anything we want to have dependencies and
# observable properties
module.exports = class ObservableObject extends Base
  @uses WithObservableProperties

  # Allows use to use the @observable decoration
  @observable: (hash) ->
    for prop, val of hash
      @::['_' + prop] = val
      Object.defineProperty @::, prop,
        enumerable: true
        configurable: true
        get: -> @getProperty prop
        set: (v) -> @setProperty prop, v

  constructor: (props) ->
    @__frames = []
    @__deps = {}

  # Change an observable property and trigger change events for it, as well as
  # any other dependent properties
  setProperty: (prop, val) ->
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

  # Access a property value and track it in the case of watching dependents
  getProperty: (prop) ->
    @['_' + prop]


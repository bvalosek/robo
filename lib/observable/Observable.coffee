WithEvents = require '../event/WithEvents.coffee'

# Basic mixin that handles standardized singalling for properties being set and
# changing. This defines the low-level event semantics used for observable
# objects
module.exports = class Observable extends WithEvents

  @ADD: 'add'
  @CHANGE: 'change'
  @REMOVE: 'remove'
  @CLEAR: 'clear'

  triggerPropertyChange: (prop) ->
    @trigger "#{Observable.CHANGE}:#{prop}"
    @trigger Observable.CHANGE

  triggerPropertySet: (prop) ->
    @trigger "#{Observable.SET}:#{prop}"

  onPropertyChange: (prop, f) ->
    if f?
      @on "#{Observable.CHANGE}:#{prop}", f
    else
      for n, cb of prop
        @on "#{Observable.CHANGE}:#{n}", cb

  onPropertySet: (prop, f) ->
    if f?
      @on "#{Observable.SET}:#{prop}", f
    else
      for n, cb of prop
        @on "#{Observable.SET}:#{n}", cb


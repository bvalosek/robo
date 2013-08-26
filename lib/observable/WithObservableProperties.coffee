WithEvents = require '../event/WithEvents.coffee'

# Basic mixin that handles standardized singalling for properties being set and
# changing. This defines the low-level event semantics used for observable
# objects
module.exports = class WithObservableProperties extends WithEvents

  triggerPropertyChange: (prop) ->
    @trigger "change:#{prop}"
    @trigger 'change'

  triggerPropertySet: (prop) ->
    @trigger "set:#{prop}"

  onPropertyChange: (prop, f) ->
    @on "change:#{prop}", f

  onChange: (f) -> @on 'change', f

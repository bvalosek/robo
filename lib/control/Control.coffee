View = require '../view/View.coffee'

# Base class for all controls that display on the UI and/or allow for user
# interaction
module.exports = class Control extends View

  @observable enabled: true

  constructor: ->
    super
    @onPropertyChange 'enabled', -> @element.disabled = not @enabled

View = require '../view/View.coffee'

# Base class for all controls that display on the UI and/or allow for user
# interaction
module.exports = class Control extends View

  @observable enabled: true

  @REQUEST_COMMAND_HANLDER: 'requestCommandHanlder'

  constructor: ->
    super
    @onPropertyChange enabled: -> @element.disabled = not @enabled

  # Bubble up through DOM, looking for somebody to ack that they can handle
  # this command. Then hook it into our events
  requestCommandHandler: (command) ->
    @triggerDomEvent Control.REQUEST_COMMAND_HANLDER, this

  # Called by some data context (such as a ViewModel) whenever we want to
  # install the handler from a requested command
  setupCommandHandler: (context, command) ->
    context.onPropertyChange command + 'CanExecute', ->
      console.log "#{command} can execute changed!"

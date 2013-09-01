ObservableObject     = require '../observable/ObservableObject.coffee'
Hashtable            = require '../util/Hashtable.coffee'
ObservableDictionary = require '../observable/ObservableDictionary.coffee'

# Abstraction of the interaction layer. Implements COMMANDs and OBSERVABLE
# properties and computed values that a view can then decide how to render.
module.exports = class ViewModel extends ObservableObject

  commands: null

  constructor: ->
    super
    @commands = new Hashtable

  # Let the command be a function on the VM and commandCanExecute as an
  # observable property
  @command: (hash) ->
    for name, {execute, canExecute} of hash
      cname = "#{name}CanExecute"
      @::[name] = execute
      ObservableObject.registerProperty @::, cname, canExecute


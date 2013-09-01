ViewModel = require 'robo/viewmodel/ViewModel'
Person    = require './Person.coffee'

module.exports = class HomeViewModel extends ViewModel

  @observable person: undefined

  @command saveUser:
    execute: -> console.log "#{@person.fullName} saved"
    canExecute: -> @person.firstName.length > 0

  constructor: ->
    super
    @person = new Person


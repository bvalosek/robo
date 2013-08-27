ObservableObject = require 'robo/observable/ObservableObject'
Person           = require './Person.coffee'

module.exports = class HomeViewModel extends ObservableObject

  @observable person: undefined

  constructor: ->
    super
    @person = new Person


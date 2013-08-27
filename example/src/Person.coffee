ObservableObject = require 'robo/observable/ObservableObject'

module.exports = class Person extends ObservableObject

  @observable
    firstName: 'John'
    lastName: 'Doe'
    age: 26
    isCool: true
    fullName: -> "#{@firstName} #{@lastName}"

  toString: -> @fullName




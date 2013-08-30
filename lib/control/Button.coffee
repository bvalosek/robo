ContentControl = require './ContentControl.coffee'

module.exports = class Button extends ContentControl

  tagName: 'button'

  @observable command: null

  constructor: ->
    super
    @content = 'Button'

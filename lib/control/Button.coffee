ContentControl = require './ContentControl.coffee'

module.exports = class Button extends ContentControl

  tagName: 'button'

  constructor: ->
    super
    @content = 'Button'


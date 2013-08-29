ContentControl = require './ContentControl.coffee'

module.exports = class Label extends ContentControl

  tagName: 'span'

  constructor: ->
    super
    @content = 'Label'


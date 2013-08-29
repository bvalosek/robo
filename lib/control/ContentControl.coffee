Control = require './Control.coffee'

# A control that represent a single piece of content such as a string, image,
# model, object, etc
module.exports = class ContentControl extends Control

  @observable content: ''

  constructor: ->
    super
    @onPropertyChange content: @render

  render: ->
    @element.innerText = @content

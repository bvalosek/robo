View           = require './View.coffee'
ObservableList = require '../observable/ObservableList.coffee'

# UI element containing other UI elements
module.exports = class ViewGroup extends View

  @observable views: null

  constructor: ->
    super
    @views = new ObservableList
    @listenTo @views, ObservableList.ADD, @_addChildView

  # Setup data context propigation
  _addChildView: ->


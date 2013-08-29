Binding        = require '../observable/Binding.coffee'
View           = require './View.coffee'
ObservableList = require '../observable/ObservableList.coffee'

# UI element containing other UI elements
module.exports = class ViewGroup extends View

  @observable views: null

  constructor: ->
    super
    @views = new ObservableList
    @listenTo @views, ObservableList.ADD, @_addChildView
    @listenTo @views, ObservableList.REMOVE, @_removeChildView

  # Setup data context propigation
  _addChildView: (view) ->
    new Binding()
      .setMode(Binding.ONE_WAY)
      .setSource(this, 'dataContext')
      .setTarget(view, 'dataContext')

    @element.appendChild view.element

  _removeChildView: (v) ->
    v.close()


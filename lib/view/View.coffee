ObservableObject = require '../observable/ObservableObject.coffee'

# Any object that can be ansigned to a DOM node. This is the lowest-level
# object that is used for all layouts, controls, views, etc
module.exports = class View extends ObservableObject

  # Initial values for creation only, should not be read during run-time as
  # assigning a new element to the element could potential mean that this would
  # no longer reflect the actual tag. Use the 'tag' property when passed to the
  # constructor to actually set the tag up for inflation
  tagName: 'div'

  constructor: (element) ->
    super
    @_setElement element ? document.createElement @tagName
    @_initEvents()

  # Should update the DOM element
  render: -> return this

  # Done with the view, attempt to close out all refs
  close: ->
    @element.parentNode.removeChild(@element)
    @element.removeEventListener()
    delete @element.roboElement
    @element = undefined
    @stopListening()
    return this

  # Change the DOM element this guy is hosted by, and ensure the DOM node
  # points back to the robo element as well. Need to un-delegate and
  # re-delegate events as well
  _setElement: (el) ->
    return if @element?
    @element = el
    el.roboElement = this
    @render()

  # Take all of the decorated events on the constructor and map them to our DOM
  # node
  _initEvents: ->
    for name, f of @constructor.EVENTS
      @element.addEventListener name, f.bind this

  # Use event decorater to easily define DOM event handlers
  @event: (hash) ->
    for name, f of hash
      (@EVENTS ?= {})[name] = f


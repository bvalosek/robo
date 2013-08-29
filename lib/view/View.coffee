Binding          = require '../observable/Binding.coffee'
ObservableObject = require '../observable/ObservableObject.coffee'

# Any object that can be ansigned to a DOM node. This is the lowest-level
# object that is used for all layouts, controls, views, etc
module.exports = class View extends ObservableObject

  # Initial values for creation only, should not be read during run-time as
  # assigning a new element to the element could potential mean that this would
  # no longer reflect the actual tag. Use the 'tag' property when passed to the
  # constructor to actually set the tag up for inflation
  tagName: 'div'

  @observable dataContext: null

  constructor: (element) ->
    super
    @bindings = []
    @_setElement element ? document.createElement @tagName
    @_initEvents()
    @onPropertyChange dataContext: @_updateBindings

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

  # Create a new binding with an IoC, target ourselves with our data context as
  # the source
  addBinding: (targetProp, sourceProp) ->
    binding = new Binding()
      .setTarget(this, targetProp)
      .setSource(@dataContext, sourceProp)

    @bindings.push binding

  # Called when the datacontext changes and we need to swap the source for all
  # of our bindings we're managing for this view
  _updateBindings: ->
    b.setSource @dataContext, b.property for b in @bindings

  # Change the DOM element this guy is hosted by, and ensure the DOM node
  # points back to the robo element as well. Need to un-delegate and
  # re-delegate events as well
  _setElement: (el) ->
    return if @element?
    @element = el
    el.roboElement = this
    @render()
    return

  # Take all of the decorated events on the constructor and map them to our DOM
  # node
  _initEvents: ->
    for name, f of @constructor.EVENTS
      @element.addEventListener name, f.bind this
    return

  # Use event decorater to easily define DOM event handlers
  @event: (hash) ->
    for name, f of hash
      (@EVENTS ?= {})[name] = f
    return


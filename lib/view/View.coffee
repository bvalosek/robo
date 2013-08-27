ObservableObject = require '../observable/ObservableObject.coffee'

# Any object that can be ansigned to a DOM node. This is the lowest-level
# object that is used for all layouts, controls, views, etc
module.exports = class View extends ObservableObject

  # Initial values for creation only, should not be read during run-time as
  # assigning a new element to the element could potential mean that this would
  # no longer reflect the actual tag. Use the 'tag' property when passed to the
  # constructor to actually set the tag up for inflation
  tagName: 'div'

  # This is observable so that we can bind to it from other things that want to
  # depend on us for their data context
  @observable dataContext: undefined

  # CSS class name. One-way bound with DOM stuff, so can only reliably be
  # updated via this property
  @observable className: ''

  constructor: ->
    # Let us mess with class name
    @onPropertyChange 'className', -> @element.className = @className

  # Change the DOM element this guy is hosted by, and ensure the DOM node
  # points back to the robo element as well. Need to un-delegate and
  # re-delegate events as well
  setElement: (el) ->
    return this if el is @element
    return @changeElement el if @element?

    @element = el
    el.roboElement = this

    # Take all registered events and set them up on the DOM
    for eventName, events of @__events
      el.addEventListener eventName, info.callback for info in events

    @render()
    return this

  # Re-assign element when already set
  changeElement: (el) ->
    return this unless el?
    return @setElement el unless @element?
    return this

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


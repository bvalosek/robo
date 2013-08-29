# Mixin that can be used to support basic eventing on any object. Uses both
# 'on/off' and 'listenTo/stopListening' flavors to support awareness of the
# event on whatever object you want to be responsible for unbinding it later
module.exports = class WithEvents

  # Private static counter used to give each listened-to object a unique id
  listenId = 0
  nextListenId = -> 'l' + listenId++

  # Bind a callback function to an event, such that when that event is
  # triggered, the callback is fired. Bind to an optional context(defaults to
  # this object).
  #
  # This method of attaching events is used when we know that *something else*
  # will trigger an event on this object, and we want to react to it
  on: (name, callback, context) ->
    return this unless name?

    @__events ?= {}
    @__events[name] ?= []

    if callback?
      @__events[name].push callback: callback, context: context ? this
    else # assume an object
      for n, cb of name
        @__events[n].push callback: cb, context: this

    return this

  # Trigger all events that have registered callbacks on this object.  Pass an
  # optional paramter that is recieved by the callback
  trigger: (name, args...) ->
    return this unless @__events? and name?

    for event in @__events[name] ? []
      event.callback.apply event.context, args

    return this

  # Remove the event callbacks from this object. Will attempt to match against
  # the context, callback and event name if provided. The fewer parameters
  # provided, the more general the removal. Calling with no paramters
  # removes all event callbacks
  off: (name, callback, context) ->
    return this unless @__events?
    unless name? or callback? or context?
      @__events = {}
      return this

    # All the event names we are going to check
    names = if name? then [name] else (key for key of @__events)

    for name in names
      continue unless @__events[name]?

      @__events[name] = for event, n in @__events[name]
        cb = not callback or callback is event.callback
        ct = not context or context is event.context

        # Pass on if it's a match to not included it in the new array,
        # otherwise add it
        continue if cb and ct
        event

      delete @__events[name] unless @__events[name]?.length

    return this

  # Inversion-of-control version of 'on'. Lets this object keep track of the
  # objects it is listening to so that it is easier to clear out the event
  # callbacks on the other object. This is used when we know another object is
  # going to fire off an event, and we want to react to it.
  listenTo: (other, name, callback) ->
    return this unless other? and name? and callback?
    @__listeningTo ?= {}

    return this unless other.on?

    # Create a unique listen id to track it as a listener, since we dont really
    # have a hash map we can use
    other.__listenId ?= nextListenId()
    @__listeningTo[other.__listenId] = other

    other.on name, callback, this

    return this

  # Corresponding to 'listenTo', clear out the event callbacks on other
  # objects to which this one is lisstening to. Like 'off', providing
  # more parameters will clear out more and more events.
  stopListening: (other, name, callback) ->
    return this unless @__listeningTo?

    listeningTo = @__listeningTo

    if other? and other.off?
      other.off name, callback, this
      delete listeningTo[other.__listenId] unless name? callback?
    else
      for id, other of listeningTo
        other.off name, callback, this
        delete listeningTo[id] unless name? callback?

    return this

  # Ensure that if we're adding these to a HashTable we can use them as the key
  # by using the listenId
  toHash: ->
    id = @__listenId ?= nextListenId()
    return "robo:WithEvents:#{id}"


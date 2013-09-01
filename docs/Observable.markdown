# Observable mixin

[View source](../lib/observable/Observable.coffee)

## Overview

## Constants

Use the following constants when you want to hook into the events fired by the
Observable. This is preferred over stringly-typed events so that your code isn't
dependent the underlying string representation.

```coffeescript
@listenTo other, Observable.CHANGE, -> ...

model.on Observable.CHANGE, -> ...

@listenTo views, Observable.CLEAR, -> ...
```

### Observable.ADD

Triggered by collection-type observables when a new element is introduced to the collection. The new element is passed as the single argument of the event.

```coffeescript
people.on Observable.ADD, (person) ->
  console.log "Hello #{person.name}!"
```

### Observable.REMOVE

The counterpart to `ADD`, this is fired whenever an element is removed from a collection-type observable, with the element that is removed being passed as the single argument of the event.

```coffeescript
people.on Observable.REMOVE, (person) ->
  console.log "Goodbye #{person.name}!"
```

### Observable.CLEAR

Fired when a collection-type observable is reset and all the elements are removed.When this happens, individual `REMOVE` events are NOT fired. This means to properly handle a collection that may dump all of its items at once, it is important to listen to this event.

```coffeescript
people.on Observable.CLEAR, ->
  console.log 'Everyone is gone!'
```

### Observable.CHANGE

The generic change event, this is fired anytime an observable changes. This means the above events (`ADD`, `REMOVE`, and `CLEAR`) will also be accompanied by a `CHANGE` event.

In addition, any change events from the constituent elements are proxied by collection, meaning if an element fires a `CHANGE` event, the observable containing it will fire one as well. This allows you to listen at the collection level and know when individual elements change.

If a change event is triggered by a child element, it will be the sole argument passed by the event.

```coffeescript
people.on Observable.CHANGE, -> peopleView.render()
```

## Methods

### onPropertyChange (`prop`, `callback`)

### onPropertyChange (`prop:callback`)

### triggerPropertyChange (`prop`)



# Robo

Great things have small beginnings. Again.

[![Build Status](https://travis-ci.org/bvalosek/robo.png?branch=master)](https://travis-ci.org/bvalosek/robo)

## What is Robo?

**Robo** is a frontend Coffeescript framework that is effectively a combination
of micro-libraries, opinionated classes and patterns, and prescriptive project
structure and build steps.

### Again

**Robo** has be re-imagined, re-started, and re-written several times.  This
time, it's in Coffeescript... so it's back to scratch one.

## Framework Components

### Events

Events are the low-level construct that power **Robo**'s dynamic features. The
eventing functions are found on the `event/WithEvents` class and can be mixed
into any class.

It features both the `on`/`off` style of setting up callbacks for when an event
is triggered, and `listenTo`/`stopListening` to invert the responsibility of
keeping track of the events.

```coffeescript
class Eventer extends Base
  @uses WithEvents # mixin pattern via robo/util/Base

  constructor: ->
    @on alert: (m) -> console.log "alert: #{m}"

a = new Eventer
a.trigger 'alert', 'some message'
```

Output:

```
alert: some message
```

[Full documentation for the `WithEvents` mixin](docs/WithEvents.markdown)

### Observable Objects

Most significant parts of **Robo** are built around the idea of *observable
objects*. This lets us build dynamic applications that react to data changes
and have rich behavior, all handled in a standard way.

Robo comes stock with several observable types: `ObservableObject`,
`ObservableList`, `ObservableDictionary`, `ObservableSet`.

#### ObservableObject Example

```coffeescript
class Person extends ObservableObject
  @observable firstName: 'John'
  @observable lastName: 'Doe'
  @observable fullName: -> "#{@firstName} #{@lastName}"

person = new Person

person.onPropertyChange
  fullName: -> console.log 'full name changed'
  firstName: -> console.log 'first name changed'

person.firstName = 'Bob'
```

Output:

```
first name changed
full name changed
```

[Full documentation for `Observable` mixin](docs/Observable.markdown)

### Views and Controls

### Data Binding

[Full documentation for the `Binding` class](docs/Binding.markdown)

### View Models

### Commands

### Data Templates

### Application, Controllers, and Routes

### Models, Queryables, and Data Persistence

### Declarative XAML Files

### Building with grunt-robo

## Testing

Testing requires [node/npm](http://nodejs.org) and
[grunt-cli](https://github.com/gruntjs/grunt-cli) to be installed on your
system.

To install all the dev dependencies and run the test target:

```
npm install
grunt test
```

## License
Copyright 2013 Brandon Valosek

**Robo** is released under the MIT license.


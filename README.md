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

### Events and Intents

#### WithEvents

Events are the low-level construct that power **Robo**'s dynamic features. The
eventing functions are found on the `event/WithEvents` class and can be mixed
into any class.

It features both the `on`/`off` style of setting up callbacks for when an event
is triggered, and `listenTo`/`stopListening` to invert the responsibility of
keeping track of the events.

#### Intent

### Observable Objects

Most significant parts of **Robo** are built around the idea of *observable
objects*. This lets us build dynamic applications that react to data changes
and have rich behavior, all handled in a standard way. Robo comes stock with
several observable types.

#### ObservableObject

```coffeescript
class Person extends ObservableObject
  @observable firstName: 'John'
  @observable lastName: 'Doe'
  @observable fullName: -> "#{@firstName} #{@lastName}"

person = new Person

person.onPropertyChange fullName: ->
  console.log 'full name changed'

# fires change event for both firstName and fullName
person.firstName = 'Bob'
```

#### ObservableList

#### ObservableSet

#### ObservableDictionary

### Views and Controls

#### ContentControl

#### ItemsControl

#### ViewGroup

### Data Binding

### Commands

### View Models

### Data Templates

### Models and Data Persistence

### Declarative XAML Files

### Building with grunt-robo

## Testing

Testing requires npm and grunt-cli to be installed on your system.

To install all the dev dependencies and run the test target:

```
npm install
grunt test
```

## License
Copyright 2013 Brandon Valosek

**Robo** is released under the MIT license.


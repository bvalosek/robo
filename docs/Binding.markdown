# Binding class

[View source](../lib/observable/Binding.coffee)

## Overview

The `Binding` class is a key part of the dynamic data binding scheme of Robo. A binding is a mediator between a `source` (such as an observable object) and a `target` (such as a `View` or DOM element and property).

For example, a `Binding`'s `source` could be an observable object `Person` and the property `firstName`. The target may be a DOM node's `innerText` property.

When the person object's `firstName` property changes, the `Binding` will in turn update the target DOM node.

```coffeescript
person = new Person
person.firstName = 'John'

new Binding()
  .setSource(person, 'firstName')
  .setTarget(document.body, 'innerText')

# <body> content is now "John"

person.firstName = 'Bob'

# <body> content is now 'Bob'
```

Typically, you will not be managing any `Binding` objects directly, but rather
relaying on other objects to keep track of them automatically or have them
setup via the declaritive structure in a View.

## Methods

### setTarget (`target`, `prop`, `mode` = `@mode`)

### removeTarget (`target`)

### setSource (`sourceObj`, `property`)

### setSource (`staticValue`)

### setMode (`mode`)

## Properties

## value


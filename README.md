# Robo

Robo is a comprehensive Javascript framework for large-scale client applications.

* **Large-scale Javascript apps are hard.** Javascript's best and worst feature
  is its ability to effectively get away with anything you want. Consistent and
  scalable practices are essential to write kickass modern apps.

* **Boilerplate is obnoxious and creates friction during development.**
  Unnecessary repetition is annoying, wastes time, and makes it difficult to
  maintain a high development velocity when changes occur.

* **A great framework let's you progressively use its features.** Progressive
  enhancement is a great philosophy for UI design; a framework should function
  the same way.

## Getting Started

### Get the source

```
git clone git@github.com:bvalosek/robo.git
```

### Compatibility

Robo makes use of ECMAScript5 features such as `Object#defineProperty()`,
`Function#bind()`, and `Array#forEach()`, which limits its compatibility to
modern, compliant browsers.

Robo should work with the following browsers:

* Chrome 7+
* Firefox 4+
* Safari 5.1+
* Opera 4+
* Internet Explorer 9+

#### Building

#### Tests

Run a http server from the root of the repo, and browse to e.g. `localhost:8080/test/index.html`.

## compose.js

* **Inheritance.** Classical inheritance goodness in Javascipt. Create a rich
  class hierarchy that feels sane, with all the power and common
  sense you've come to expect in an object-oriented language.

* **Functional mixins.**  Inspired by [Angus Croll's
  article](http://javascriptweblog.wordpress.com/2011/05/31/a-fresh-look-at-javascript-mixins/)
  on using functions to mutate an object and add new functionality. The
  `before`, `after`, and `wrapped` annotations can be used to modifiy existing
  functions.

* **Member annotations.** Use modifiers on class members or mixin members to
  change their behavior or enforce inheritance and access semantics, or use
  custom annotations and reflection to amp up your own classes and reduce
  boilerplate.

* **Define-time semantics checking.** Use the `virtual`, `abstract`, and
  `override` member annotations to ensure predictable inheritance behavior, and
  get feedback in the form of define-time errors when implementation contracts
  are broken.

## compose.Object

Base class constructor.

```
compose.Object
    extend()
    using()
    findAnnotations()
    findMembers()
    Super
    parent
    __name__
    __annotations__
    __mixins__
    prototype
        is()
        mixin()
        constructor
        __mixins__
```

#### compose.Object#extend()

#### compose.Object#using()

#### compose.Object#findAnnotations()

#### compose.Object#findMembers()

#### compose.Object#Super

#### compose.Object#parent

#### compose.Object.prototype#is()

#### compose.Object.prototype#mixin()

### Inheritance

### Functional Mixins

### Class Member Annotations

#### Inheritance

The inheritance annotations are used to govern and check the inheritance
semantics of your classes.

All inheritance annotations only add additional checking override during
define time; no run-time overhead is incurred.

##### virtual

The `virtual` annotation is used to indicate that a class member or property
may be overriden (via the `override` annotation) in a later derived class.

All class members are non-virtual be default, meaning that you must explicitly
declare a member as `virtual` or a declare-time exception will be thrown if a
derived class hides a virtual member.

##### abstract

##### override

##### new

#### Accessors

Accessor annotations can create getters and setters out of class members.

##### get

##### set

##### property

##### result

### Mixin Member Annotations

Mixin annotations are used to augment the targeted function they are mixing in
on top of.

##### before

##### after

##### wrapped

### Modifier Annotations

Modifier annotations change the accessibility of members.

##### hidden

##### readonly

##### const

##### sealed

##### static

### Implicit Annotations

These annotations are automatically added via the class system, and cannot be
used directly.

##### mixin

##### augmented

## The Robo Framework

### Framework

### Page

### Model

### View

### Template

### Controls

#### Standard Elements

#### CollectionView

## Special Thanks

### Contributers

* Brandon Valosek [@bvalosek](http://twitter.com/bvalosek)
* Dillon Shook [dshook.is](http://dshook.is)

### Open Source libraries

* Backbone
* Underscore
* JQuery
* QUnit
* requireJS

## License
Copyright 2013 Brandon Valosek

Robo is released under the new BSD and MIT licenses.


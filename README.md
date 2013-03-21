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

* **Member annotations.**

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
    __name__
    __annotations__
    __mixins__
    prototype
        is()
        mixin()
        constructor
        __mixins__
```

#### extend()

#### using()

#### findAnnotations()

#### findMembers()

#### is()

#### mixin()

### Inheritance

### Functional Mixins

### Member Annotations

#### Inheritance

##### override

##### virtual

##### abstract

##### new

#### Accessors

##### get

##### set

##### property

##### result

##### memoize

##### once

#### Mixins

##### before

##### after

##### wrapped

#### Modifiers

##### hidden

##### readonly

##### const

##### sealed

##### static

## The Robo Framework

### Application

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

## License
Copyright 2013 Brandon Valosek [@bvalosek](http://twitter.com/bvalosek)

Robo is released under the new BSD and MIT licenses.


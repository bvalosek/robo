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

```
git clone git@github.com:bvalosek/robo.git
```

### Compatibility

Robo makes use of ECMAScript5 features such as `Object#defineProperty()`,
`Function#bind()`, and `Array#forEach()`, which limits its compatibility to
modern, compliant browsers.

Robo _should_ work with the following browsers:

* Chrome 7+
* Firefox 4+
* Safari 5.1+
* Opera 4+
* Internet Explorer 9+


## compose.js -- Where the magic happens

* **Inheritance.**
* **Functional mixins.**
* **Member annotations.**
* **Define-time semantics checking.**

## compose.Object

```
Class
    extend()
    mixin()
    Super
    findAnnotations()
    findMembers()
    __name__
    __anotations__
    __mixins__
    prototype
        is()
        mixin()
        constructor
        __mixins__
```

#### extend()

#### mixin()

##### On the constructor (class)

##### On the prototype (instance)

#### findAnnotations()

#### findKeys()

#### is()

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

### Open Source libraries

## License
Copyright 2013 Brandon Valosek [@bvalosek](http://twitter.com/bvalosek)

Robo is released under the new BSD and MIT licenses.


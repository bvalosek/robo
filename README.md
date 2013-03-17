# Robo

Robo is a comprehensive Javascript framework for large-scale client applications. Its primary motivation comes from:

* **Large-scale Javascript apps are hard.** Javascript's best and worst feature
  is its ability to pretty much get away with anything you want. Consistent and
  scalable practices are essential to write kickass modern apps.
* **Boilerplate is obnoxious and creates friction during development.**
  Unnecessary repetition is annoying, wastes time, and makes it difficult to
  maintain a high development velocity when changes occur.
* **A great framework let's you progressively use its features.** Progressive
  enhancement is a great philosophy for UI design; a framework should function
  the same way.

## The Good Stuff

### Inheritance

Basic class definition

```javascript
var Lifeform = Base.extend({

    constructor: function()
    {
        this.alive = true;
    },

    kill: function()
    {
        this.alive = false;
    },

});
```

Basic inheritence

```javascript
var Human = Lifeform.extend({

    eat: function()
    {
        console.log('tasty');
    }

});
```

```javascript
var person = new Human();   // this.alive == true
person.eat();               // 'tasty'
person.kill()               // this.alive == false
```

### Functional Mixins

### Member Annotations

### Model-View-Template

### Controls


## License
Copywrite 2013 Brandon Valosek, @bvalosek

Robo is released under the new BSD and MIT licenses.


# Robo

Robo is a comprehensive Javascript framework for large-scale client applications.

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

Concept of a mixin

```javascript
function withWalk = function() 
{
    this.walk = function() { console.log('walking...'); }
}
```

Robo mixin
```javascript
var withWalk = compose.createMixin({

    walk: function()
    {
        console.log('walking...');
    }

});

var Human = Lifeform.mixin(withWalking).extend({

    // ...

})
```

```javascript
person.walk() // 'walking...'
```

### Member Annotations

#### Inheritence
```javascript
var Lifeform = Base.Extend({

    // CAN be overriden in derived class
    __virtual__speak: function() 
    {
        console.log('the sound of nothing');
    },

    // MUST be overriden in derived class
    __abstract__move: undefined

    // accessible directly on class
    __static__const__TAG: 'lifeform class'
});

var Human = Lifeform.extend({

    __override__move: function()
    {
        console.log('walk on 2 legs');
    },

    __override__speak: function()
    {
        console.log('blah blah');
    },

});

var Lizard = Lifeform.extend({

    // ERROR: must use 'override' annotation
    move: function()
    {
        // ...
    }

    // ERROR: must implement abstract member 'speak'

});

```

#### Accessors

#### Mixins

#### Models

#### Views

#### Custom

### Model-View-Template

### Controls


## License
Copywrite 2013 Brandon Valosek, @bvalosek

Robo is released under the new BSD and MIT licenses.


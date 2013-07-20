# Robo
Make awesome Javascript apps.

## Shit That's Important

### WithObservableProperties

This is a **mixin** that gives a class the `triggerPropertyChanged` method.
While this doesn't actually power property watching or event firing, this is
the low-level mixin that an object should include if we intend to monitor any
of its properties.

### IList

The **interface** that guarantees our class will have list-like behavior, and
standarizes how to add and remove elements from it. This is used for everything
from `Collection` objects to `ViewGroup` objects.

## License
Copyright 2013 Brandon Valosek

**Robo** is released under the MIT licenses.


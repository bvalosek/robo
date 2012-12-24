define(function(require) {
    var _ = require('underscore');

    // empty constructor
    Base = function() {};

    var makeExtender = function(Parent)
    {
        return function(Child)
        {
            Child = Child || Parent;

            // access to original methods
            Child.__super__ = Parent.prototype;

            // setup proto chain
            var ctor = function() {};
            ctor.prototype = Parent.prototype;
            Child.prototype = new ctor();
            Child.prototype.constructor = Child;

            // propagate extender
            Child.extend = makeExtender(Child);
            return Child;
        };
    };

    Base.extend = makeExtender(Base);
    return Base;
});

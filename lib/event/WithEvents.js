var typedef = require('typedef');
var _       = require('underscore');

module.exports = WithEvents = typedef

// Mixin used to add eventing ability to an object. Inspired by / stolen
// from Backbone.js. This is the implementation that is and mixed in to any
// Robo object taht needs to be able to do event stuff
.mixin('WithEvents') .define({

    // Bind a callback function to an event, such that when that event is
    // triggered, the callback is fired. Bind to an optional
    // context(defaults to this object). This is used when we know that
    // *something else* will trigger an event on this object, and we want
    // to react to it
    __fluent__on: function(name, callback, _context)
    {
        if (!this.__events)
            Object.defineProperty(this, '__events', {
                configurable: true, enumberable: false,
                writable: true, value: {}
            });

        var events = this.__events[name] || (this.__events[name] = []);

        events.push({
            callback: callback,
            context: _context,
            ctx: _context || this
        });

        return this;
    },

    // Trigger all events that have registered callbacks on this object.
    // Pass an optional paramter that is recieved by the callback
    __fluent__trigger: function(name, _options)
    {
        if (!this.__events) return this;
        var events = this.__events[name];

        _(events).each(function(event) {
            event.callback.call(event.ctx, _options);
        });

        return this;
    },

    // Inversion-of-control version of 'on'. Let's this object keep track
    // of the objects it is listening to so that it is easier to clear out
    // the event callbacks on the other object. This is used when we know
    // another object is going to fire off an event, and we want to react
    // to it.
    __fluent__listenTo: function(obj, name, callback)
    {
        if (!this.__listeningTo)
            Object.defineProperty(this, '__listeningTo', {
                configurable: true, enumberable: false,
                writable: true, value: {}
            });

        var listeningTo = this.__listeningTo;

        var id = obj._listenerId || (obj._listenerId = _.uniqueId('l'));
        listeningTo[id] = obj;

        obj.on(name, callback, this);
        return this;
    },

    // Remove the event callbacks from this object. Will attempt to match
    // against the context, callback and event name if provided. The fewer
    // parameters provided, the more general the removal. Calling with no
    // paramters removes all event callbacks
    __fluent__off: function(_name, _callback, _context)
    {
        var _this = this;

        if (!_name && !_callback && !_context) {
            this.__events = {};
            return this;
        }

        var names = _name ? [_name] : _.keys(this.__events);
        _(names).each(function(name) {
            var events = _this.__events[name];

            _(events).each(function(info, index) {
                var remove = !_callback || (_callback === info.callback);
                remove = remove || !_context || (_context === info.context);

                if (remove)
                    events.splice(index, 1);

            });

            if (!events.length)
                delete _this.__events[name];
        });

        return this;
    },

    // Corresponding to 'listenTo', clear out the event callbacks on other
    // objects to which this one is lisstening to. Like 'off', providing
    // more parameters will clear out more and more events.
    __fluent__stopListening: function(_obj, _name, _callback)
    {
        var listeningTo = this.__listeningTo;
        if (!listeningTo) return this;

        if (_obj)
            (listeningTo = {})[_obj._listenerId] = _obj;

        var deleteEntry = !_name && !_callback;

        var _this = this;
        _(listeningTo).each(function(other, id) {
            other.off(_name, _callback, _this);
            if (deleteEntry)
                delete _this.__listeningTo[id];
        });

        return this;
    },

    // Bind any events that we've declared via decorations. Allows for
    // using the EVENT decoration as a short-hand for binding to this with
    // a basic event
    initEvents: function()
    {
        var _this = this;
        _(typedef.signature(this.constructor)).each(function(info, key) {
            if (info.decorations.EVENT) {
                _this.on(key, info.value.bind(_this));
            }
        });
    },

    // Define all of the events we've labeled on the class
    __ondefine__: function(C, hash)
    {
        if (hash && hash.__events__) {
            C.events = {};
            _(hash.__events__).each(function(eventName) {
                C.events[eventName] = eventName;
            });
        }
    }

});

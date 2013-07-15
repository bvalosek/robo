var typedef = require('typedef');
var _       = require('underscore');

module.exports = WithEvents = typedef

// Mixin used to add eventing ability to an object. Inspired by / stolen
// from Backbone.js. This is the implementation that is outlined by IEvents
// and mixed in to any Robo object taht needs to be able to do event stuff
.mixin('WithEvents') .define({

    __ondefine__: function(C, hash)
    {
        // Add in events hash
        if (hash && hash.__events__)
        {
            C.events = {};
            _(hash.__events__).each(function(eventName) {
                C.events[eventName] = eventName;
            });
        }
    },

    // Bind a callback to when an event fires on this object
    __fluent__on: function(name, callback, _context)
    {
        // Ensure we have our events stack
        if (!this._events) this._events = {};
        var events = this._events[name] || (this._events[name] = []);

        events.push({
            callback: callback,
            context: _context,      // used for tracking our binding
            ctx: _context || this   // what the function bound against
        });

        return this;
    },

    // Trigger all events that have registered callbacks on this object.
    // Pass an optional paramter that is recieved by the callback
    __fluent__trigger: function(name, _options)
    {
        // Find the stack of events for this eventName
        if (!this._events) return this;
        var events = this._events[name];

        // call everything
        _(events).each(function(event) {
            event.callback.call(event.ctx, _options);
        });

        return this;
    },

    // Inversion of control version of on, requires the targeting object of
    // course to (hopefully) implement WithEvents. This allows us to clear
    // out the stuff we've listening to easily by keeping track *here*
    __fluent__listenTo: function(obj, name, callback)
    {
        var listeningTo = this._listeningTo || (this._listeningTo = {});

        // ensure that we are tracking what we are listening to for later,
        // hashed for convenience
        var id = obj._listenerId || (obj._listenerId = _.uniqueId('l'));
        listeningTo[id] = obj;

        // IoC bind it
        obj.on(name, callback, this);
        return this;
    },

    // Remove event callbacks for this object. All parameters are optional,
    // with more paramters being used to be more specific on what we are
    // removing
    __fluent__off: function(_name, _callback, _context)
    {
        var _this = this;

        // Clear it all out ?
        if (!_name && !_callback && !_context) {
            this._events = {};
            return this;
        }

        // Iterate over all (or just a single) event name, check to see if
        // we can remove this stuff
        var names = _name ? [_name] : _.keys(this._events);
        _(names).each(function(name) {
            var events = _this._events[name];

            // iterate over each registered callback to see if we want to remove it
            _(events).each(function(info, index) {
                var remove = !_callback || (_callback === info.callback);
                remove = remove || !_context || (_context === info.context);

                if (remove)
                    events.splice(index, 1);

            });

            // no more ?
            if (!events.length)
                delete _this._events[name];
        });

        return this;
    },

    __fluent__stopListening: function(_obj, _name, _callback)
    {
        var listeningTo = this._listeningTo;
        if (!listeningTo) return this;

        // if we spcific an object, make sure to only check that one by
        // making an ad-hoc hash with only that one
        if (_obj)
            (listeningTo = {})[_obj._listenerId] = _obj;

        // if we're removing all events of an object, delete the entry in
        // the registry of things we're listening to
        var deleteEntry = !_name && !_callback;

        // loop over everything we're listening to and request we off that
        // shit from the other
        var _this = this;
        _(listeningTo).each(function(other, id) {
            other.off(_name, _callback, _this);
            if (deleteEntry)
                delete _this._listeningTo[id];
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
    }

});

define(function(require) {

    var compose  = require('compose');
    var _        = require('underscore');
    var Log      = require('robo/util/Log');

    // Mixin used to add eventing ability to an object. Inspired by / stolen
    // from Backbone.js
    return compose.mixin('WithEvents').define({

        // Bind a callback to when an event fires on this object
        __fluent__on: function(name, callback, _context)
        {
            // Ensure we have our events stack
            if (!this._events) this._events = {};
            var events = this._events[name] || (this._events[name] = []);

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
            if (!this._events) return this;
            var events = this._events[name];

            _(events).each(function(event) {
                event.callback.call(event.ctx, _options);
            });

            // stuff bound to all
            _(this._events.all).each(function(event) {
                event.callback.call(event.ctx, name, _options);
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
            names = _name ? [_name] : _.keys(this._events);
            _(names).each(function(name) {
                var events = _this._events[name];

                // iterate over each registered callback to see if we want to remove it
                _(events).each(function(info, index) {
                    var remove = !_callback || (_callback === info.callback);
                    remove = remove || !_context || (_context === info.context);

                    if (remove)
                        delete events[index];

                });

                // no more ?
                if (!events.length)
                    delete _this.events[name];
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

        // Bind any events that we've declared via decorations
        initEvents: function()
        {
            var _this = this;
            _(this.constructor.__signature__).each(function(info, key) {
                if (info.decorations.EVENT) {
                    _this.on(key, info.value.bind(_this));
                }
            });
        },

        // Output events to the log for this object
        __fluent__logEvents: function()
        {
            var tag = this.cid || this.id || this.TAG ||
                this.constructor.__name__;

            this.on('all', function(e) {
                Log.d(tag + ' -> ' + e);
            });

            return this;
        }

    });

});

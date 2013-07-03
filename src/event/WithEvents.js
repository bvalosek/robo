define(function(require) {

    var compose  = require('compose');
    var _        = require('underscore');
    var Log      = require('robo/util/Log');

    // Mixin used to add eventing ability to an object
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

            return this;
        },

        // Inversion of control version of on, requires the targeting object of
        // course to (hopefully) implement WithEvents. This allows us to clear
        // out the stuff we've listening to easily
        __fluent__listenTo: function(obj, name, callback)
        {
            var listeners = this._listeners || (this._listeners = {});
            obj.on(name, callback, this);
            return this;
        },

        // Remove event callbacks for this object. All parameters are optional,
        // with more paramters being used to be more specific on what we are
        // removing
        __fluent__off: function(_name, _callback, _context)
        {
            return this;
        },

        __fluent__stopListening: function()
        {
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

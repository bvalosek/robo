define(function(require) {

    var _       = require('underscore');
    var keymage = require('keymage');
    var Base    = require('./Base');
    var log     = require('./log');
    var View    = require('./View');

    var KeyManager = Base.extend(function(context) {
        this.context = context;
        this._keyMap = {};
    });

    // given a keys combo, bind some action to a context. Only one action can
    // be bound to a keys/context combo
    KeyManager.prototype.addKey = function(keys, context, fn)
    {
        var actions = this._keyMap[keys];

        // nothing has been bound for this key combo
        if (!actions) {
            keymage(
                keys,
                this.handlerFactory(keys)
            );

            actions = this._keyMap[keys] = [];
        }

        // don't double bind
        if (_(actions).find(function(x) { return x.context === context; })) {
            log(keys + ' already bound for this context');
            return;
        }

        // unbind on close if we can
        if(context.bind)
            context.bind(View.ON.HIDE, _(this.clearKeys).bind(this, context));

        // add this bad boy
        actions.push({ context: context, fn: fn });

        log(actions.length + ' actions bound for keys "' + keys + '"');
    };

    // clear out all keys for a given context
    KeyManager.prototype.clearKeys = function(context)
    {
        _(this._keyMap).each(function(actions, keys) {
            _(actions).each(function(x, n) {
                if (x.context === context) {
                    actions.splice(n, 1);
                    log('clearing out "' + keys + '" for this context');
                }
            });
        });
    };

    // create a function that can handle all of the given actions for a key
    // combo that may come up
    KeyManager.prototype.handlerFactory = function(keys)
    {
        return function() {
            log('keys pressed: ' + keys);

            // figure out what action we want by context
            var app = this.context;
            var action = _(this._keyMap[keys]).find(function(x) {
                if (app.isActiveContext(x.context))
                    x.fn.call(x.context);
            });

        }.bind(this);
    };

    return KeyManager;
});

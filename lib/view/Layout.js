var typedef      = require('typedef');
var Binding      = require('../event/Binding');
var WithTemplate = require('../view/WithTemplate');
var UiElement    = require('../view/UiElement');

// A declarative HTML-powered view that is tied to a DOM element and is
// responsible for creating and maintaining bindings and widgets
var Layout = typedef.class('Layout')
    .extends(UiElement)
    .uses(WithTemplate).define({

    __constructor__: function()
    {
        this.bindings = [];
        this.widgets  = [];
    },

    __virtual__template: '',

    // Allow us to set our data context and update all of our bindings
    __property__dataContext:
    {
        get: function() { return this._dataContext; },
        set: function(v) { this.setDataContext(v); }
    },

    __fluent__setDataContext: function(context)
    {
        this._dataContext = context;
        var _this = this;

        // Reset existing bindings
        _(this.bindings).each(function(b) { b.reset(); });
        this.bindings = [];

        // Instantiate and attach and widgets we have specified
        _(this.element.querySelectorAll('[data-robo-class]'))
            .each(function(element) {

                // Skip anything we've already built
                if (element.roboElement)
                    return;

                // Get the module path from the attribute, must be loaded
                // somewhere else with a proper require() call
                var mod = element
                    .getAttribute('data-robo-class')
                    .replace(/\./g, '/');
                var C      = require(mod);
                var widget = new C().setElement(element);
                _this.widgets.push(widget);

                // If this widget is some kind of layout (manages its own
                // stuff, overridable datacontext, etc
                if (typedef.is(widget, Layout)) {
                    var sContext = element.getAttribute('data-robo-context');
                    if (sContext) {
                        var dc = Layout.resolvePath(context, sContext);

                        // It's coming from our viewModel so it "should" be
                        // observable, let's create a binding
                        new Binding()
                            .setSource(dc.obj, dc.key)
                            .setTarget(widget, 'dataContext');
                    } else {
                        widget.setDataContext(context);
                    }
                }
        });

        // For all elements that specify a binding, create our Binding
        // objects to the underlying data context
        _(this.element.querySelectorAll('[data-robo-bind]'))
            .each(function(element) {

                // If this element was already bound by somebody else, then
                // return. If it was bound by us, we are re-binding
                if (element.boundBy !== undefined && element.boundBy !== _this) {
                    return;
                }

                var bindings = element.getAttribute('data-robo-bind');
                var info     = Layout.parseBindings(bindings);

                _(info).each(function(s, t) {
                    var source = Layout.resolvePath(context, s);
                    var target = Layout.resolvePath(
                        element.roboElement || element, t);

                    _this.bindings.push(
                        new Binding()
                            .setSource(source.obj, source.key)
                            .setTarget(target.obj, target.key)
                        );
                });

                element.boundBy = _this;
        });

        return this;
    },

    // Return back an obj and path specified
    __static__resolvePath: function(root, path)
    {
        var s         = path.match(/^[^.]+/)[0];
        var node      = root[s];
        var remainder = path.substring(s.length);

        if (remainder && remainder.length)
            return Layout.resolvePath(node, remainder.substring(1));

        return {obj: root, key: path};
    },

    // Translate a binding string into a hash
    __static__parseBindings: function(s)
    {
        var ret = {};

        s.split(',').forEach(function(p) {
            var a    = p.split(':');
            var key  = a[0].trim();
            var val  = a[1].trim();
            ret[key] = val;
        });

        return ret;
    }

});

module.exports = Layout;


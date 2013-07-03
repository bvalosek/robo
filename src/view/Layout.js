define(function(require) {

    var compose      = require('compose');
    var Binding      = require('robo/event/Binding');
    var WithTemplate = require('robo/view/WithTemplate');
    var UiElement    = require('robo/view/UiElement');

    // A declarative HTML-powered view that is tied to a DOM element and is
    // responsible for creating and maintaining bindings and widgets
    var Layout = compose.class('Layout')
        .extends(UiElement)
        .uses(WithTemplate).define({

        __constructor__: function()
        {
            this.bindings = [];
            this.widgets  = [];
        },

        __virtual__template: '',

        __fluent__setDataContext: function(context)
        {
            this.dataContext = context;
            var _this = this;

            // Instantiate and attach and widgets we have specified
            _(this.element.querySelectorAll('[data-robo-widget]'))
                .each(function(element) {
                    var mod = element
                        .getAttribute('data-robo-widget')
                        .replace(/\./g, '/');

                    var C      = require(mod);
                    var widget = new C().setElement(element);

                    _this.widgets.push(widget);

                    // do we need to set data context?
                    if (compose.is(widget, Layout)) {
                        widget.setDataContext(context);
                    }
            });

            // For all elements that specify a binding, create our Binding
            // objects to the underlying data context
            _(this.element.querySelectorAll('[data-robo-binding]'))
                .each(function(element) {

                    // ensure that if this element was already bound (via sub
                    // layout) that we don't step on that shit
                    if (element.roboBound) {
                        return;
                    }

                    var bindings = element.getAttribute('data-robo-binding');
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

                    element.roboBound = true;
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

    return Layout;

});

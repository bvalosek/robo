define(function(require) {

    var compose      = require('compose');
    var Binding      = require('robo/event/Binding');
    var WithTemplate = require('robo/view/WithTemplate');
    var UiElement    = require('robo/view/UiElement');

    var Layout = compose.class('Layout')
        .extends(UiElement)
        .uses(WithTemplate).define({

        __virtual__template: '',

        __fluent__setDataContext: function(context)
        {
            this.dataContext = context;

            // Do all widgets
            _(this.element.querySelectorAll('[data-robo-widget]'))
                .each(function(element) {
                    var mod = element.getAttribute('data-robo-widget').replace(/\./g, '/');
                    var C = require(mod);
                    new C().setElement(element);
            });

            // Do all bindings
            var _this = this;
            _(this.element.querySelectorAll('[data-robo-binding]'))
                .each(function(element) {
                    var bindings = element.getAttribute('data-robo-binding');
                    var info = Layout.parseBindings(bindings);

                    _(info).each(function(s, t) {
                        var source = Layout.resolvePath(context, s);
                        var target = Layout.resolvePath(element.roboElement, t);

                        new Binding()
                            .setSource(source.obj, source.key)
                            .setTarget(target.obj, target.key);
                    });
            });

            return this;
        },

        __static__resolvePath: function(root, path)
        {
            var s         = path.match(/^[^.]+/)[0];
            var node      = root[s];
            var remainder = path.substring(s.length);

            if (remainder && remainder.length)
                return Layout.resolvePath(node, remainder.substring(1));

            return {obj: root, key: path};
        },

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

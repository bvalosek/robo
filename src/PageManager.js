define(function(require, exports, module) {

    var _       = require('underscore');
    var compose = require('compose');
    var log     = require('./log');

    var PageManager = compose.defineClass({

        // stash the app context
        __constructor__PageManager: function(application) {
            this.application = application;
            this.urls = [];
        },

        addPage: function(urlPattern, Page, argNames)
        {
            this.urls.push({
                pattern: urlPattern,
                Page: Page,
                argNames: argNames
            });
        },

        // boot the page that we found a match for
        routePage: function()
        {
            var url = window.location.pathname;

            var m;
            var page = _(this.urls).find(function(p) {
                m = url.match(p.pattern);
                return m;
            });

            if (!page) {
                log('no page mapping found for this url. Good bye Robo');
                return;
            }

            // array of arguments if our pattern has sub-matches
            var args = m.length > 1 ? m.slice(1) : undefined;

            // if we're naming the arguments
            if (args && page.argNames) {
                var h = {};

                // create the new object with the keys corresponding to what we
                // setup with the addPage calls
                for (var i = 0; i < page.argNames.length; i++) {
                    var key = page.argNames[i];
                    h[key] = args[i];
                }

                args = h;
            }

            var p = new page.Page(args);
            p.application = this.application;
        }

    });

    return PageManager;
});

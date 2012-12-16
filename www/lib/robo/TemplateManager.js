define(function(require) {

    var $   = require('jquery');
    var _   = require('underscore');

    var log = require('./log');

    // static templates
    var _templates = {};

    var TemplateManager = function() {};

    // load a template from the cache, assumes everything is in html directory
    TemplateManager.prototype.get = function(path, callback)
    {
        var promise = _templates[path];

        // do request if not already started/finished
        if (!promise) {
            promise = $.ajax({
                url: path + '.html',
                cache: false
            });
            _templates[path] = promise;
        }

        // actually do the template
        promise.done(function(t) {
            callback(_.template(t));
        });

        promise.fail(function() {
            log('Could not load template ' + path);
        });

        return promise;
    };

    return TemplateManager;
});

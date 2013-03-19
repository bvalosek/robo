define(function(require, exports, module) {

    var helpers = require('../helpers');

    // all the native Backbone.js events
    return helpers.makeHash([
        'close',
        'click',
        'add',
        'remove',
        'reset',
        'sort',
        'change',
        'destroy',
        'request',
        'sync',
        'error',
        'invalid',
        'route',
        'all'
    ]);

});

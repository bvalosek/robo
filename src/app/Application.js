define(function(require, exports, module) {

    var Observable = require('robo/event/Observable');
    var WithEvents = require('robo/event/WithEvents');
    var Log        = require('robo/util/Log');
    var compose    = require('compose');

    // Starting point for a Robo app. Call Application#start() to boot up
    return compose.class('Application')
        .uses(WithEvents)
        .implements(Observable).define({

        constructor: function()
        {
            this.initEvents();
        },

        __virtual__start: function()
        {
            Log.d('Application started');
            this.trigger('init');
        },

    });

});

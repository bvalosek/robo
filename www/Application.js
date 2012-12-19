define(function(require) {

    var RoboApp           = require('lib/robo/Application');
    var log               = require('lib/robo/log');

    // base styles
    require('less!style/base.less');

    var Application = RoboApp.extend();

    // main function
    Application.prototype.onCreate = function()
    {
    };

    return Application;
});

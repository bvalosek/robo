define(function(require) {

    var config      = require('config');
    var log         = require('./log');

    var Application = require('./Application');

    log('bootstrapping app');

    // start the correspoding application
    var App = config.Application || Application;
    Application.instance = new App();

    // misc
    document.title = config.title || 'Robo';
});

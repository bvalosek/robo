var Application      = require('../../lib/app/Application');
var ObservableObject = require('../../lib/event/ObservableObject');
var Log              = require('../../lib/util/Log');
var typedef          = require('typedef');

module.exports = ExampleApp =
typedef.class('ExampleApp').extends(Application).define({

    __event__onStart: function()
    {
        Log.d('Hello, World!');
    }


});

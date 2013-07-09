var Application = require('../lib/app/Application');
var compose     = require('compose');

module.exports = ExampleApp = compose.class('ExampleApp').extends(Application).define({

    __constructor__: function()
    {
    }

});

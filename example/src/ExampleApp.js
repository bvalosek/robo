var Application      = require('../../lib/app/Application');
var typedef          = require('typedef');

module.exports = ExampleApp =
typedef.class('ExampleApp').extends(Application).define({

    __event__onStart: function()
    {
        global.app = this;

        // Setup route table
        this.addRoutes(require('./routes'));

        // Manually route for now
        this.route({ uri: '/' });
    }

});

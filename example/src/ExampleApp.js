var Application       = require('../../lib/app/Application');
var DefaultController = require('./controllers/DefaultController');
var typedef           = require('typedef');

module.exports = ExampleApp =
typedef.class('ExampleApp').extends(Application).define({

    __event__onStart: function()
    {
        // Setup route table
        this.addRoutes({
            uri: /.*/,
            controller: DefaultController
        });

        // Manually route for now
        this.route({ uri: '/' });
    }

});

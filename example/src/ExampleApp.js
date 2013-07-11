var Application = require('../../lib/app/Application');
var XmlResource = require('../../lib/util/XmlResource');
var typedef     = require('typedef');

module.exports = ExampleApp =
typedef.class('ExampleApp').extends(Application).define({

    __event__onStart: function()
    {
        // Setup route table
        this.addRoutes(require('./routes'));

        // Manually route for now
        this.route({ uri: '/' });

        var config = require('./R')('config.xml');
        console.log(config);
        console.log(XmlResource.flattenResource(config));
    }

});

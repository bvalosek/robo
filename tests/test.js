define(function(require, exports, module) {

    var compose = require('robo/compose');

    var C = compose.defineClass({

        constructor: function()
        {
            console.log('hello world');
        }

    });

    new C();

});

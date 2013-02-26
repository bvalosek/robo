define(function(require, exports, module) {

    var asRenderable = require('./mixins/asRenderable');
    var compose      = require('./compose');
    var Base         = require('robo/Base');

    var View = Base.mixin(asRenderable).extend({

        constructor: function()
        {
            this.setupView();
        }

    });

    return View;
});

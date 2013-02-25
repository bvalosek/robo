define(function(require, exports, module) {

    var asRenderable = require('./mixins/asRenderable');
    var compose      = require('./compose');
    var Base         = require('robo/Base');

    var View = Base.extend(function()
    {
        this.setupView();
    }).mixin(asRenderable);


    return View;
});

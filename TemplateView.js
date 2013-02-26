define(function(require, exports, module) {

    var View         = require('./View');
    var withTemplate = require('./mixins/withTemplate');

    var TemplateView = View.mixin(withTemplate).extend({

        constructor: function()
        {
            TemplateView.Super.call(this);
        }

    });

    return TemplateView;
});

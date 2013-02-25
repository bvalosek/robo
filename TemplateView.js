define(function(require, exports, module) {

    var View         = require('./View');
    var withTemplate = require('./mixins/withTemplate');

    var TemplateView = View.mixin(withTemplate).extend(function()
    {
        View.call(this);
    });

    return TemplateView;
});

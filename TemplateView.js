define(function(require, exports, module) {

    var View         = require('./View');
    var withTemplate = require('./mixins/withTemplate');

    var TemplateView = View.extend(function()
    {
        View.call(this);
    }).mixin(withTemplate);

    return TemplateView;
});

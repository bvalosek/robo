define(function(require, exports, module) {

    var withTemplate = require('./withTemplate');
    var View         = require('./View');

    var TemplateView = View.using(withTemplate).extend({
        __name__: 'TemplateView',

        __virtual__template: '',

    });

    return TemplateView;
});

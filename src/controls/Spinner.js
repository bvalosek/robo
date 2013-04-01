define(function(require, exports, module) {

    var SelectControl = require('./SelectControl');
    var withTemplate  = require('../view/withTemplate');
    var TemplateView  = require('../view/TemplateView');
    var Collection    = require('robo/model/Collection');

    var Spinner = SelectControl.extend({

        __override__readonly__tagName: 'select',

        __constructor__Spinner: function()
        {
            this.keyAttribute   = this.keyAttribute || 'cid';
            this.valueAttribute = this.valueAttribute || 'cid';
            this.View           = this.createRowView();
            this.collection     = this.collection || new Collection();

            Spinner.Super.apply(this, arguments);
        },

        createRowView: function()
        {
            var t = '<%= model[\'' + this.valueAttribute + '\'] %>';
            console.log(t);
            return TemplateView.extend({
                __override__readonly__tagName: 'option',
                __override__template: '<%= model[\'' + this.valueAttribute + '\'] %>'
            });
        },

        __static__SpinnerRow: TemplateView.extend({
            __override__readonly__tagName: 'option',
            __override__template: 'hey'
        })

    });

    return Spinner;
});

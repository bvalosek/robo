define(function(require) {

    var compose = require('compose');
    var View    = require('robo/view/View');

    return compose.class('InputText').extends(View).define({

        __override__readonly__tagName: 'input',

        __observable__text: '',

        __event__keyup: function()
        {
            console.log(this);
            this.text = this.element.value;
        },

        __override__fluent__render: function()
        {
            this.element.value = this.text;
            return this;
        }

    });

});

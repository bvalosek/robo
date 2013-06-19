define(function(require) {

    var View    = require('robo/view/View');
    var compose = require('compose');

    return compose.class('Label').extends(View).define({

        __override__readonly__tagName: 'span',

        __observable__html: undefined,
        __observable__text: '',

        __override__fluent__render: function()
        {
            if (this.html !== undefined)
                this.element.innerHTML = this.html;
            else
                this.element.innerText = this.text;

            return this;
        }

    });

});

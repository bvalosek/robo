define(function(require) {

    var compose       = require('compose');
    var Widget        = require('robo/widget/Widget');
    var ClickListener = require('robo/view/ClickListener');

    return compose.class('Button')
        .extends(Widget)
        .implements(ClickListener).define({

        __override__readonly__tagName: 'button',

        __virtual__event__click: function(event) { console.log('hey'); }

    });

});

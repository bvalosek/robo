define(function(require) {

    var compose     = require('compose');
    var TextControl = require('robo/widget/TextControl');

    return compose.class('Button').extends(TextControl).define({

        __override__tag: 'button'

    });

});

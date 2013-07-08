define(function(require) {

    var compose     = require('compose');
    var TextControl = require('robo/widget/TextControl');

    return compose.class('Label').extends(TextControl).define({

        __override__readonly__tagName: 'span'

    });

});

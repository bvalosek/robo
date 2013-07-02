define(function(require) {

    var compose      = require('compose');
    var ValueControl = require('robo/widget/ValueControl');

    return compose.class('TextInput').extends(ValueControl).define({

        __override__tagName: 'input'

    });

});

var compose     = require('compose');
var TextControl = require('robo/widget/TextControl');

module.exports = compose.class('Button').extends(TextControl).define({

    __override__readonly__tagName: 'button'

});


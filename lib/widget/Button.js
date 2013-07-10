var typedef     = require('typedef');
var TextControl = require('robo/widget/TextControl');

module.exports = typedef.class('Button').extends(TextControl).define({

    __override__readonly__tagName: 'button'

});


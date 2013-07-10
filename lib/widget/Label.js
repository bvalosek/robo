var typedef     = require('typedef');
var TextControl = require('robo/widget/TextControl');

module.exports = typedef.class('Label').extends(TextControl).define({

    __override__readonly__tagName: 'span'

});

var compose     = require('compose');
var TextControl = require('robo/widget/TextControl');

module.exports = compose.class('Label').extends(TextControl).define({

    __override__readonly__tagName: 'span'

});

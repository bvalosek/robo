var ContentControl = require('./ContentControl');

module.exports = Label = require('typedef')

.class('Label') .extends(ContentControl) .define({

    __override__observable__contentProperty__content : 'Label',

    __override__readonly__tagName                    : 'span'

});

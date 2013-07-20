var ContentControl = require('./ContentControl');

module.exports = Button = require('typedef')

.class('Button') .extends(ContentControl) .define({

    __override__readonly__tagName: 'button'

});

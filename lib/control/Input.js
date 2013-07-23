var Control = require('./Control');

module.exports = Input = require('typedef')

.class('Input') .extends(Control) .define({

    __override__readonly__tagName : 'input'

});

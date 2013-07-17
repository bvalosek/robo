var Control = require('./Control');

module.exports = ContentControl = require('typedef')

// A control that represents a single arbitrary object, string, text, model,
// etc
.class('ContentControl') .extends(Control) .define({

    __observable__contentProperty__content: null

});

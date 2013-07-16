var Control            = require('./Control');
var IHandleChildObject = require('../xml/IHandleChildObject');

module.exports = ContentControl = require('typedef')

// A control that represents a single arbitrary object, string, text, model,
// etc
.class('ContentControl') .extends(Control) .implements(IHandleChildObject) .define({

    __observable__content: null,

    handleChildObject: function(obj)
    {
        this.content = obj;
    }

});

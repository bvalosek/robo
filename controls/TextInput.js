define(function(require, exports, module) {

    var Control = require('../Control');

    var TextInput = Control.extend({

        constructor: function()
        {
            TextInput.Super.call(this, {
                tagName: 'input',
                attributes: {
                    type: 'text'
                }
            });
        }

    });

    return TextInput;
});

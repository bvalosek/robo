var ObservableObject = require('../../../lib/event/ObservableObject');

module.exports = require('typedef')

// View Model
.class('HomeViewModel') .extends(ObservableObject) .define({

    __observable__messageInput: '',

    __observable__messageFeedback: function()
    {
        if (this.messageInput)
            return 'Press "Save" when done';
        else
            return 'Type something into the box';
    },

    __observable__canSave: function()
    {
        return !!this.messageInput.length;
    }

});

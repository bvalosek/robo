var ObservableObject = require('../../../lib/event/ObservableObject');

module.exports = require('typedef')

.class('HomeViewModel') .extends(ObservableObject) .define({

    __observable__messageInput: '',

    __computed__messageFeedback: function()
    {
        if (this.messageInput)
            return 'Press "Save" when done';
        else
            return 'Type something into the box';
    }


});

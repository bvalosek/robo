var ObservableObject = require('../../../lib/event/ObservableObject');

module.exports = require('typedef')

.class('HomeViewModel') .extends(ObservableObject) .define({

    __observable__messageInput: '',

    __computed__messageLength: function()
    {
        return this.messageInput.length;
    },

    __computed__messageFeedback: function()
    {
        if (this.messageInput)
            return 'Press "Save" when done';
        else
            return 'Type something into the box';
    },

    __computed__imageUrl: function()
    {
        return 'http://www.cdpe.com/assets/images/accelerate/images/week-' +
            (this.messageLength > 11 ? 12 : this.messageLength + 1) + '.png';
    },

    __computed__canSave: function()
    {
        return !!this.messageLength;
    },

    execute: function()
    {
        console.log('saved ' + this.messageInput);
        this.messageInput = '';
    }

});

var ObservableObject = require('../../lib/event/ObservableObject');
var WithEventLogging = require('../../lib/util/WithEventLogging');

module.exports = require('typedef')

.class('HomeViewModel') .extends(ObservableObject) .uses(WithEventLogging) .define({

    __observable__text: '',

    __computed__disableSubmit: function()
    {
        return !this.text.length;
    },

    __computed__submitCaption: function()
    {
        return this.disableSubmit ? 'TYPE SOMETHING!' : 'SUBMIT';
    },

    __computed__message: function()
    {
        return 'currently the submit button is ' +
            (this.disableSubmit ? 'disabled' : 'enabled') +
            ' and the user has typed "' + this.text + '"';
    }

});

var ObservableObject = require('../../lib/event/ObservableObject');
var WithEventLogging = require('../../lib/util/WithEventLogging');

module.exports = require('typedef')

.class('HomeViewModel') .extends(ObservableObject) .uses(WithEventLogging) .define({

    __observable__text: '',

    __computed__disableSubmit: function() {
        return !this.text.length;
    }

});

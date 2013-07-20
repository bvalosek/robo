var ObservableObject = require('../../lib/event/ObservableObject');
var loader           = require('../../lib/xml/loader');
var R                = require('./R');
var Person           = require('./Person');

module.exports = require('typedef')

// View Model
.class('HomeViewModel') .extends(ObservableObject) .define({

    __observable__person    : null,
    __observable__people    : null,
    __observable__userInput : '',

    __constructor__: function()
    {
        this.person = new Person();
        this.people = loader(R('people.xml'));
    },

    __observable__parsedInput: function()
    {
        var parts = this.userInput.split(' ');

        var first = '', last = '';

        if (parts.length == 1) {
            first = parts[0];
        } else if (parts.length == 2) {
            first = parts[0];
            last  = parts[1];
        }

        return { firstName: first, lastName: last };
    }

});

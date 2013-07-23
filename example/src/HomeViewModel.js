var ObservableObject = require('../../lib/event/ObservableObject');
var loader           = require('../../lib/xml/loader');
var R                = require('./R');
var Person           = require('./Person');

module.exports = require('typedef')

// View Model
.class('HomeViewModel') .extends(ObservableObject) .define({

    __observable__people        : null,
    __observable__currentPerson : null,

    __constructor__: function()
    {
        this.people = loader(R('people.xml'));
        this.currentPerson = this.people.first();
    }

});

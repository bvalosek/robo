var ObservableObject = require('../../lib/event/ObservableObject');
var Person           = require('./Person');

module.exports = require('typedef')

// View Model
.class('HomeViewModel') .extends(ObservableObject) .define({

    __constructor__: function()
    {
        this.person = new Person();
    },

    __observable__person: null,

});

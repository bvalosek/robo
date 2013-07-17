var ObservableObject = require('../../../lib/event/ObservableObject');

module.exports = Person = require('typedef')

.class('Person') .extends(ObservableObject) .define({

    __observable__firstName  : 'John',
    __observable__lastName   : 'Doe',
    __observable__age        : 26,

    __observable__fullName : function()
    {
        return this.firstName + ' ' + this.lastName;
    },

    __virtual__talk: function()
    {
        console.log('My name is ' + this.firstName + ' ' + this.lastName);
    },

});

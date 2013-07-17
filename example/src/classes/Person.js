module.exports = Person = require('typedef')

.class('Person') .define({

    firstName : 'John',
    lastName  : 'Doe',
    age       : 26,

    __virtual__talk: function()
    {
        console.log('My name is ' + this.firstName + ' ' + this.lastName);
    },

});

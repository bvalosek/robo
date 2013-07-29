var ObservableObject = require('../../lib/event/ObservableObject');
var Collection       = require('../../lib/model/Collection');

module.exports = Person = require('typedef')

.class('Person') .extends(ObservableObject) .define({

    __observable__firstName : 'John',
    __observable__lastName  : 'Doe',
    __observable__age       : 26,
    __observable__friends   : null,
    __observable__isCool    : true,

    __constructor__: function()
    {
        this.friends = new Collection();
    },

    __observable__fullName : function()
    {
        return this.firstName + ' ' + this.lastName;
    },

    __override__hidden__toString: function()
    {
        return this.fullName;
    }

});

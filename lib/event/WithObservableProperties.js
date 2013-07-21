var WithEvents = require('../event/WithEvents');

module.exports = WithObservableProperties = require('typedef')

// This mixin should be added to anything that we plan on letting other object
// listen to change notifications when properties are changed
.mixin('WithObservableProperties') .uses(WithEvents) .define({

    // Our class should call this to notify any listeners that a property has
    // changed
    triggerPropertyChanged: function(prop)
    {
        this.trigger('change');
        this.trigger('change:' + prop);
    },

    // Explicit set
    triggerPropertySet: function(prop)
    {
        this.trigger('change');
        this.trigger('set:' + prop);
        this.trigger('change:' + prop);
    },

    onPropertyChange: function(prop, fn)
    {
        return this.on('change:' + prop, fn);
    },

    listenToPropertyChange: function(other, prop, fn)
    {
        return this.listenTo(other, 'change:' + prop, fn);
    },


});

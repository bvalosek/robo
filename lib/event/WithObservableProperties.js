var WithEvents = require('../event/WithEvents');

module.exports = WithObservableProperties = require('typedef')

// This mixin should be added to anything that we plan on letting other object
// listen to change notifications when properties are changed
.mixin('WithObservableProperties') .uses(WithEvents) .define({

    // Our class should call this to notify any listeners that a property has
    // changed (but not necesarily been set)
    triggerPropertyChanged: function(prop)
    {
        this.trigger('change:' + prop);
        this.trigger('change');
    },

    // Explicitly have set a property on this object
    triggerPropertySet: function(prop)
    {
        this.trigger('set:' + prop);
        this.trigger('change:' + prop);
        this.trigger('change');
    },

    onPropertyChange: function(prop, fn)
    {
        return this.on('change:' + prop, fn);
    }

});

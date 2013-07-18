var View    = require('./View');
var Binding = require('../event/Binding');
var typedef = require('typedef');

module.exports = ViewGroup = typedef

// A UI element that contains other UI elements. All children must be Views.
// Manages datacontext propigation
.class('ViewGroup') .extends(View) .define({

    // Used to allow the loader to add Child elements
    __property__contentProperty__nextChild:
    {
        get: undefined,
        set: function(v) { this.addChildView(v); }
    },

    // Hook into listening to this and add it to our DOM element. It is
    // possible this isn't an actual view, in which case just blindly stick it
    // into the DOM
    addChildView: function(view)
    {
        if (!typedef.is(view, View)) {
            this.element.appendChild(view);
            return;
        }

        if (!view.dataContext)
            new Binding()
                .setSource(this, 'dataContext')
                .setTarget(view, 'dataContext');

        this.element.appendChild(view.element);
    },

});

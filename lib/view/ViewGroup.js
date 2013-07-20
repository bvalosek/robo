var View    = require('./View');
var Binding = require('../event/Binding');
var IList   = require('../model/IList');
var typedef = require('typedef');

module.exports = ViewGroup = typedef

// A UI element that contains other UI elements. All children must be Views.
// Manages datacontext propigation
.class('ViewGroup') .extends(View) .implements(IList) .define({

    // Hook into listening to this and add it to our DOM element. It is
    // possible this isn't an actual view, in which case just blindly stick it
    // into the DOM
    addChildView: function(view)
    {
        if (!typedef.is(view, View)) {
            this.element.appendChild(view);
            return;
        }

        this.trackView(view);

        this.element.appendChild(view.element);
    },

    trackView: function(view)
    {
        if (!view.dataContext)
            new Binding()
                .setSource(this, 'dataContext')
                .setTarget(view, 'dataContext');
    },

    // IList
    __fluent__add: function(value)
    {
        this.addChildView(value);
        return this;
    },

    // IList
    __fluent__remove: function(value)
    {
        return this;
    },

    // IList
    __fluent__clear: function()
    {
        return this;
    },

    // IList
    get: function(index)
    {

    },

    // IList
    indexOf: function(value)
    {

    },

    // IList
    count: function()
    {

    }

});

var View    = require('./View');
var Binding = require('../event/Binding');
var typedef = require('typedef');

module.exports = ViewGroup = typedef

// A UI element that contains other UI elements. All children must be Views.
// Manages datacontext propigation
.class('ViewGroup') .extends(View) .define({

    __observable__contentProperty__views: null,

    // Setup the collection and make sure to add the child view when we add to
    // the list
    __constructor__: function()
    {
        this.views = new Collection();
        this.listenTo(this.views, 'add', this._addChildView);
    },

    // Hook into listening to this and add it to our DOM element. It is
    // possible this isn't an actual view, in which case just blindly stick it
    // into the DOM
    _addChildView: function(view)
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
    }

});

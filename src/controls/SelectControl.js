define(function(require, exports, module) {

    var ModelControl   = require('./ModelControl');
    var CollectionView = require('../view/CollectionView');

    // any control used for chosing one of multiple options
    // model / attribute is what we are changing (optional)
    // collectionView for how we represent
    var SelectControl = CollectionView.extend({

        __constructor__SelectControl: function(opts)
        {
            SelectControl.Super.apply(this, arguments);
        }

    });

    return SelectControl;
});

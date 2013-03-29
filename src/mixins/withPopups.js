define(function(require, exports, module) {

    var Application = require('../Application');
    var compose     = require('compose');

    // the ability to open popups with a certain context to ensure that a close
    // event will remove the popup
    var withPopups = compose.defineMixin(
    {
        showPopup: function(view)
        {
            Application.instance().addPopup(view);
            this.on('close', view.close.bind(view));
        }

    });

    return withPopups;
});

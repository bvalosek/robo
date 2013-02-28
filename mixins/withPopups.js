define(function(require, exports, module) {

    var Application = require('robo/Application');
    var events      = require('events');

    // the ability to open popups with a certain context to ensure that a close
    // event will remove the popup
    var withPopups = function()
    {
        this.showPopup = function(view)
        {
            Application.instance().addPopup(view);
            this.on(events.CLOSE, view.close.bind(view));
        };
    };

    return withPopups;
});

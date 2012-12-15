define(function(require) {

    var $ = require('jquery');

    var Application = function() {
        $('body').html('asdf');
    };

    // register an Activity and all its info
    Application.prototype.manifestActivity = function(info)
    {
        this.activityManifest = this.activityManifest || [];
        this.activityManifest.push(info);
    };

    return Application;
});

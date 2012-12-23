define(function(require) {

    var Backbone    = require('backbone');

    var log         = require('./log');

    var Router = Backbone.Router.extend({
        routes: {
            '*url' : 'router'
        }
    });

    // create a router in the context of ActivityManager
    Router.factory = function(managerContext)
    {
        var r = new Router();
        r.context = managerContext;

        return r;
    };

    // force a re-look at the hash
    Router.prototype.check = function()
    {
        this.router(window.document.location.hash);
    };

    // launch Activity based on URL
    Router.prototype.router = function(url)
    {
        url = url.replace(/^#?!?\/?/,'');

        var Activity = this.context.getActivityByUrl(url);

        if (Activity)
            this.context.startActivity(Activity);
    };

    Router.prototype.setUrl = function(url)
    {
        this.navigate('!/' + url);
    };

    return Router;
});

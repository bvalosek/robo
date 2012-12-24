define(function(require) {

    var Backbone    = require('backbone');

    var log         = require('./log');

    var Router = Backbone.Router.extend({
        routes: {
            '*url' : '_router'
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
        this._router(window.document.location.hash, true);
    };

    // normalize the url
    Router.prototype.normalize = function(url)
    {
        return (url || '').replace(/^#?!?\/?/,'');
    };

    Router.prototype._router = function(url, ignoreCrumb)
    {
        var url = this.normalize(url);

        var matches = url.match(/^([0-9a-f\-]{36})?\/?(.*)$/);

        var crumb   = matches[1];
        var url     = matches[2];

        if (crumb && !ignoreCrumb)
            this.crumbRouter(crumb, url);
        else
            this.urlRouter(url, crumb);
    };

    // launch Activity based on URL
    Router.prototype.urlRouter = function(url, crumb)
    {
        log('url route:' + url);

        var Activity = this.context.getActivityByUrl(url);

        if (Activity)
            this.context.startActivity(Activity);
    };

    // if we've got a crumb
    Router.prototype.crumbRouter = function(crumb, url)
    {
        log('crumb route:' + url);

        if (!this.context.goToCrumb(crumb)) {
            log('invalid crumb, maybe hit forward, who knows');
        }
    };

    Router.prototype.setUrl = function(url)
    {
        this.navigate('!/' + url);
    };

    return Router;
});

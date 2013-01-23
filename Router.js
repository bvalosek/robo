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

    // normalize the url
    Router.prototype.normalize = function(url)
    {
        return (url || '').replace(/^#?!?\/?/,'');
    };

    // what actually routes from the url event
    Router.prototype._router = function(url)
    {
        url = this.normalize(url);

        var matches = url.match(/^(view[0-9]+)?\/?(.*)$/);

        var crumb = matches[1];
        url = matches[2];

        if (crumb)
            this.crumbRouter(crumb, url);
        else
            this.urlRouter(url);
    };

    // launch Activity based on URL
    Router.prototype.urlRouter = function(url)
    {
        log('url route:' + url);

        var Activity = this.context.getActivityByUrl(url);

        if (Activity)
            this.context.startActivity(Activity);
    };

    // try to find activity based on crumb, fall back to URL
    Router.prototype.crumbRouter = function(crumb, url)
    {
        log('crumb route:' + url);

        if (!this.context.goToCrumb(crumb)) {
            log('invalid crumb, routing as url');
            this.urlRouter(url, crumb);
        }
    };

    // crunch bang
    Router.prototype.setUrl = function(url)
    {
        this.navigate('!/' + url);
    };

    return Router;
});

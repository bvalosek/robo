define(function(require) {

    var Base        = require('./Base');
    var log         = require('./log');
    var $           = require('jquery');

    var Geometry = Base.extend(function(opts) {

        opts = _(opts).defaults({
            preserveX: false,
            preserveY: false,
            $w: $('html')
        });

        // hardcoded magic numbers
        var FONT_RATIO     = 16 / 640;
        var ASPECT_RATIO   = 2;

        // calcs
        this.screen        = {};

        var $w = opts.$w;

        this.screen.$el    = $w;
        this.screen.width  = $w.width();
        this.screen.height = $w.height();
        this.screen.ratio  = this.screen.width / this.screen.height;

        // how much to scale text
        var val;
        if (opts.preserveX) {
            val = this.screen.width / ASPECT_RATIO;
            log('explicit preserveX');
        } else if (opts.preserveY) {
            val = this.screen.height / ASPECT_RATIO;
            log('explicit preserveY');
        } else if (this.screen.width / ASPECT_RATIO < this.screen.height) {
            val = this.screen.width / ASPECT_RATIO;
            log('guessing preserveX geometry');
        } else {
            val = this.screen.height / ASPECT_RATIO;
            log('guessing preserveY geometry');
        }

        this.baseTextSize = val * FONT_RATIO;
    });

    // events
    Geometry.ON =
    {
        SET: 'geometry:set'
    };

    // update for an activity
    Geometry.updateActivity = function(activity)
    {
        var m = activity.manifest;
        if (activity.$el.hasClass('reactive-geometry'))
            new Geometry({
                $w: activity.$el,
                preserveX: m.screen ? m.screen.preserveX : false,
                preserveY: m.screen ? m.screen.preserveY : false
            }).updateBaseSize();
    };

    // update base size for an entire selector
    Geometry.updateAllSizes = function(selector)
    {
        $(selector).each(function() {
            new Geometry({$w: $(this) }).updateBaseSize();
        });
    };

    // updates the page's font size base according to the geometry
    Geometry.prototype.updateBaseSize = function()
    {
        this.screen.$el.css('font-size', this.baseTextSize + 'px');
        return this;
    };

    return Geometry;
});

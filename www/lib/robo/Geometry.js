define(function(require) {

    var Base        = require('./Base');
    var log         = require('./log');
    var Application = require('./Application');

    var $           = require('jquery');

    var Geometry = Base.extend(function(opts) {

        opts = _(opts).defaults({
            preserveX: false,
            preserveY: false,
            $w: $('html')
        });

        // hardcoded magic numbers
        var FONT_RATIO     = 22 / 640;
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
        if (this.screen.width / ASPECT_RATIO < this.screen.height) {
            val = this.screen.width / ASPECT_RATIO;
            log('guessing preseveX geometry');
        } else {
            val = this.screen.height / ASPECT_RATIO;
            log('guessing preseveY geometry');
        }

        this.baseTextSize = val * FONT_RATIO;
    });

    // events
    Geometry.ON =
    {
        SET: 'geometry:set'
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
        Application.getInstance().trigger(
            Geometry.ON.SET, this.baseTextSize);
        return this;
    };

    return Geometry;
});

define(function(require, exports, module) {

    var helpers       = require('./compose/helpers');
    var extendMethods = require('./compose/extend');
    var mixinMethods  = require('./compose/mixin');

    // seed mixin -- mix this into any object to get some STRAIGHT UP MAGIG.
    // Assumes no other thing will be setting up objects other than this mixin
    var withCompose = function()
    {
        // setup instance members
        helpers.setupPrototype(this);

        helpers.defHidden(this, {
            mixin: mixinMethods.mixin,
            __mixins__: []
        });

        // done if not a constructed object
        if (!this.constructor)
            return;

        var Ctor = this.constructor;

        // Add all the necesary goodies on the actual type (the constructor)
        helpers.setupConstructor(Ctor, null, 'Object');

        // add in the extender and usinger
        helpers.defHidden(Ctor, {
            extend: extendMethods.makeExtend(Ctor),
            using: mixinMethods.makeUsing(Ctor)
        });
    };

    // root object
    var Base = function() {};
    mixinMethods.mixin(Base.prototype, withCompose);

    // exposed API
    var compose = {

        // should be primary use of compose.js for creating new Classes and
        // mixins
        defineMixin : mixinMethods.defineMixin,
        defineClass : Base.extend,

        // root object if needed
        Object      : Base,
        mixin       : mixinMethods.mixin,
        withCompose : withCompose
    };

    return compose;
});

define(function(require, exports, module) {

    var extendMethods = require('./compose/extend');
    var mixinMethods  = require('./compose/mixin');
    var helpers       = require('./compose/helpers');

    var mixin       = mixinMethods.mixin;
    var makeExtend  = extendMethods.makeExtend;
    var defineMixin = function() {};

    // seed mixin -- mix this into any object to get some STRAIGHT UP MAGIG.
    // Assumes no other thing will be setting up objects other than this mixin
    var withCompose = function()
    {
        // setup instance members
        helpers.defHidden(this, {
            is         : helpers.is.bind(this, this),
            mixin      : mixin.bind(this, this),
            __mixins__ : []
        });

        // done if not a constructed object
        if (!this.constructor)
            return;

        var Ctor = this.constructor;

        // Add all the necesary goodies on the actual type (the constructor)
        helpers.setupConstructor(Ctor, null);

        // add in the extender and usinger
        Ctor.extend = makeExtend(Ctor);
        Ctor.using = function() {};
    };

    // root object
    var Base = function() {};
    mixin(Base.prototype, withCompose);

    // the annotations constants because I hate stringly type shit
    var annotations = helpers.makeHash([
        'override', 'virtual', 'abstract', 'new', 'get', 'set', 'property',
        'result', 'memoize', 'once', 'before', 'after', 'wrapped', 'hidden',
        'readonly', 'const', 'sealed', 'static']);

    // exposed API
    var compose = {

        // should be primary use of compose.js for creating new Classes and
        // mixins
        defineMixin : defineMixin,
        defineClass : Base.extend,
        annotations : annotations,

        // root object if needed
        Object      : Base,
        mixin       : mixin,
        withCompose : withCompose
    };

    return compose;
});

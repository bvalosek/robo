define(function(require) {

    var compose       = require('compose');
    var BackboneModel = require('robo/backbone/Model');
    var Collection    = require('robo/model/Collection');

    compose.namespace('robo.model');

    return compose.class('Model').extends(BackboneModel).define({

        __virtual__urlRoot: null,

        __static__Collection: Collection,

        constructor: function()
        {
        },

        // Make sure to setup a static Collection that uses the stuff from the
        // model object and getting the attributes ready
        __ondefine__: function(M)
        {
            var className  = M.__name__ + 'Collection';
            var memberName = 'Collection';

            C = compose.class(className)
                .extends(Collection)
                .define({
                    __override__url: M.prototype.urlRoot || '',
                    __override__model: M
                });

            M[memberName] = C;
            M.__annotations__[memberName] = {STATIC: true};

            // all the attributes
            var _this = this;
            _(M.__annotations__).each(function(a, key) {
                if (a.ATTRIBUTE) {
                    Object.defineProperty(M.prototype, key, {
                        configurable: true, enumberable: true,
                        get: function() {
                            return this.attributes[key];
                        },
                        set: function(v) {
                            this.set(key, v);
                        }
                    });
                }
            });
        },
    });
});

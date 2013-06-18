define(function(require) {

    var compose       = require('compose');
    var BackboneModel = require('robo/backbone/Model');
    var Observable    = require('robo/event/Observable');
    var Collection    = require('robo/model/Collection');

    return compose.class('Model').extends(BackboneModel).define({

        __virtual__urlRoot: null,

        __static__Collection: Collection,

        constructor: function()
        {
        },

        // Make sure to setup a static Collection that uses the stuff from the
        // model object
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
        }

    });

});

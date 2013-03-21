define(function (require, exports, module)
{

    var compose = require('robo/compose');

    test('Mixins', function ()
    {
        var BaseMix = compose.defineClass({
            __virtual__render: function ()
            {
                return 'base render';
            }
        });

        var RenderMix = compose.defineMixin({
            __wrapped__render: function (render)
            {
                return 'mix ' + render();
            },

            newMix: function ()
            {
                return 'new mix';
            }
        });

        var MixChild = BaseMix.using(RenderMix).extend({

        });


        var mixChild = new MixChild();
        equal(mixChild.render(), 'mix base render');
        equal(mixChild.newMix(), 'new mix');

        var OverrideMixChild = BaseMix.using(RenderMix).extend({
            __override__render: function ()
            {
                return 'overridden render';
            }
        });

        var overrideMixChild = new OverrideMixChild();
        equal(overrideMixChild.render(), 'overridden render');

    });
});

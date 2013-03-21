define(function (require)
{
    module('Mixins');
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

    test('Mixin Inheritance', function ()
    {
        var Child1 = compose.defineClass({
            __name__: 'Child1'
        });
        
        var Child2 = Child1.extend({
            __name__: 'Child2'
        });

        equal(Child2.__name__, 'Child2', 'Self Name');
        equal(Child2.Super.__name__, 'Child1', 'Super name');

        var TestMix = compose.defineMixin({
            newMix: function ()
            {
                return 'new mix';
            }
        });

        var ChildM = Child2.using(TestMix);
        equal(ChildM.Super.__name__, 'Child1', 'Mixin super name');

        var ChildME = ChildM.extend({
            __name__: 'ChildME'
        });
        equal(ChildME.Super.Super.__name__, 'Child1', 'Extended mixin grandparent name');

        var ChildMixDirect = Child2.using(TestMix).extend({
            __name__: 'ChildMixDirect'
        });
        equal(ChildMixDirect.Super.Super.__name__, 'Child1', 'Direct Extended mixin grandparent name');

    });

    test('Mixin Ordering', function ()
    {
        var fakeGlobal = '';

        var Base = compose.defineClass({
            __virtual__print: function ()
            {
                fakeGlobal += '2';
            }
        });

        var MixBefore = compose.defineMixin({
            __before__print: function ()
            {
                fakeGlobal += '1';
            }
        });

        var MixAfter = compose.defineMixin({
            __after__print: function ()
            {
                fakeGlobal += '3';
            }
        });

        var MixWrap = compose.defineMixin({
            __wrapped__print: function (print)
            {
                fakeGlobal += '0';
                print();
                fakeGlobal += '4';
            }
        });

        var BaseBefore = Base.using(MixBefore);
        var BaseAfter = BaseBefore.using(MixAfter);
        var BaseWrap = BaseAfter.using(MixWrap);

        var baseWrap = new BaseWrap();
        baseWrap.print();
        equal(fakeGlobal, '01234');
    });
});

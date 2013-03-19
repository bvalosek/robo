define(function(require, exports, module) {

    var compose = require('robo/compose');

    

    var BaseClass = compose.defineClass({

        __virtual__render: function()
        {
            return 'base render';
        },
        __virtual__baseMethod: function ()
        {
            return 'base method';
        },

        basePlain: 1,
        __virtual__baseVirtual: 2,
        __abstract__baseAbstract: undefined,

    });

    var ChildClass = BaseClass.extend({
        __override__render: function ()
        {
            return 'child render';
        },
        childMethod: function ()
        {
            return 'child method';
        },

        __override__baseVirtual: -2,
        __override__baseAbstract: -3,
    });

    test('Basic Inheritance', function ()
    {
        var child = new ChildClass();
        equal(child.render(), 'child render');
        equal(child.childMethod(), 'child method');
        equal(child.baseMethod(), 'base method');
        equal(child.basePlain, 1);
        equal(child.baseVirtual, -2);
        equal(child.baseAbstract, -3);

    });
    
    test('Bad Inheritance', function ()
    {
        throws(function ()
        {
            BaseClass.extend({
            
            });
        },
        'Missing abstract');

        throws(function ()
        {
            BaseClass.extend({

                render: function(){
                    return 'new render';
                },
                __override__baseAbstract: -3,
            });
        },
        'Missing override');
    });

    test('New function', function ()
    {
        var newChild = BaseClass.extend({
            __override__baseAbstract: -3,
            __new__hidden__render: function ()
            {
                return 'new render';
            },
        });

        equal(newChild.render(), 'new render');
    });

    var ModifierTest = compose.defineClass({
        __hidden__h: 1,
        __readonly__ro: 2,
        __const__c: 3,
        __sealed__s: 4,
        __static__st: 5
    });

    test('Modifiers', function ()
    {
        var mt = new ModifierTest();
        equal(mt.h, 1);
        equal(mt.ro, 2);
        equal(mt.c, 3);
        equal(mt.s, 4);
        equal(ModifierTest.st, 5);

        throws(function ()
        {
            mt.c = -4;
        }, 'Assign to const');

        mt.ro = -2;
        equal(mt.ro, 2, 'Assigning to read only does not change value');

        throws(function ()
        {
            ModifierTest.extend({
                __readonly__const__roc: 3,
            });
        },
       'Const and readonly are not both allowed');
      
    });


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

        var MixChild = BaseMix.mixin(RenderMix).extend({

        });

        
        var mixChild = new MixChild();
        equal(mixChild.render(), 'mix base render');
        equal(mixChild.newMix(), 'new mix');

        var OverrideMixChild = BaseMix.mixin(RenderMix).extend({
            __override__render: function ()
            {
                return 'overridden render';
            }
        });

        var overrideMixChild = new OverrideMixChild();
        equal(overrideMixChild.render(), 'overridden render');

    });

    test('Multiple level inheritance', function ()
    {

        var Grandfather = compose.defineClass({

            __virtual__name: function ()
            {
                return 'grandfather';
            },

            __virtual__lineage: function ()
            {
                return 1;
            }
        });

        var FatherClass = Grandfather.extend({
            __override__name: function ()
            {
                return 'father';
            },
            __override__lineage: function ()
            {
                return FatherClass.Super.lineage() + 1;
            }
        });

        var ChildClass = FatherClass.extend({
            __override__name: function ()
            {
                return 'child';
            },
            __override__lineage: function ()
            {
                return ChildClass.Super.lineage() + 1;
            }
        });

        var grandfather = new Grandfather();
        var father = new FatherClass();
        var child = new ChildClass();

        equal(grandfather.name(), 'grandfather');
        equal(father.name(), 'father');
        equal(child.name(), 'child');

        equal(child.lineage(), 3);
    });

});

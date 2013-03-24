define(function (require)
{
    module('compose.js Modifiers');
    var compose = require('robo/compose');

    var BaseClass = compose.defineClass({

        __virtual__render: function ()
        {
            return 'base render';
        }

    });

    test('New function', function ()
    {
        var newChild = BaseClass.extend({
            __new__hidden__render: function ()
            {
                return 'new render';
            }
        });

        var o = new newChild();

        equal(o.render(), 'new render');
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
        equal(mt.h, 1, 'Hidden');
        equal(mt.ro, 2, 'Read only');
        equal(mt.c, 3, 'Const');
        equal(mt.s, 4, 'Sealed');
        equal(ModifierTest.st, 5, 'Static');

        throws(function ()
        {
            mt.c = -4;
        }, 'Assign to const');

        mt.ro = -2;
        equal(mt.ro, 2, 'Assigning to read only does not change value');

        throws(function ()
        {
            ModifierTest.extend({
                __readonly__const__roc: 3
            });
        },
       'Const and readonly are not both allowed');

        throws(function()
        {
            ModifierTest.extend({
                __new__s: 6
            });
        },
        'Sealed throws error on New redefinition');

        var ModifierChild = ModifierTest.extend({

        });
        var modifierChild = new ModifierChild();
        equal(ModifierChild.Super.st, 5, 'Static inheritance');

        throws(function ()
        {
            ModifierChild.extend({
                __new__s: 7
            });
        },
        'Inherited sealed throws on new redefinition');
    });


});

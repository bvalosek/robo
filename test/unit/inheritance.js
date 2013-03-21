define(function (require)
{
    module('Inheritance');
    var compose = require('robo/compose');

    var BaseClass = compose.defineClass({

        __virtual__render: function ()
        {
            return 'base render';
        },
        __virtual__baseMethod: function ()
        {
            return 'base method';
        },

        basePlain: 1,
        __virtual__baseVirtual: 2,
        __abstract__baseAbstract: undefined

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
        __override__baseAbstract: -3
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
                someMethod: function () { }
            });
        },
        'Missing abstract');

        throws(function ()
        {
            BaseClass.extend({

                render: function ()
                {
                    return 'new render';
                },
                __override__baseAbstract: -3
            });
        },
        'Missing override');
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
                return FatherClass.parent.lineage() + 1;
            }
        });

        var ChildClass = FatherClass.extend({
            __override__name: function ()
            {
                return 'child';
            },
            __override__lineage: function ()
            {
                return ChildClass.parent.lineage() + 1;
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

    //Wikipedia translations
    test('Strategy Pattern', function ()
    {
        var Strategy = compose.defineClass({
            __abstract__execute: function (a, b) { return undefined; }
        });

        var Add = Strategy.extend({
            __override__execute: function (a, b)
            {
                return a + b;
            }
        });

        var Multiply = Strategy.extend({
            __override__execute: function (a, b)
            {
                return a * b;
            }
        });

        var Context = compose.defineClass({
            constructor: function (strategy)
            {
                this.strategy = strategy;
            },

            executeStrategy: function (a, b)
            {
                return this.strategy.execute(a, b);
            }
        });

        var multiplyContext = new Context(new Multiply());
        var addContext = new Context(new Add());

        equal(multiplyContext.executeStrategy(2, 4), 8);
        equal(addContext.executeStrategy(2, 4), 6);
    });

});

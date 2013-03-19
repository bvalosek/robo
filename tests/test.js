define(function(require, exports, module) {

    var compose = require('robo/compose');

    

    var BaseClass = compose.defineClass({

        __virtual__render: function()
        {
            return "base render";
        },
        __virtual__baseMethod: function ()
        {
            return "base method";
        },

        basePlain: 1,
        __virtual__baseVirtual: 2,
        __abstract__baseAbstract: undefined,

    });

    var ChildClass = BaseClass.extend({
        __override__render: function ()
        {
            return "child render";
        },
        childMethod: function ()
        {
            return "child method";
        },

        __override__baseVirtual: -2,
        __override__baseAbstract: -3,
    });

    test('Basic Inheritance', function ()
    {
        var child = new ChildClass();
        equal(child.render(), "child render");
        equal(child.childMethod(), "child method");
        equal(child.baseMethod(), "base method");
        equal(child.basePlain, 1);
        equal(child.baseVirtual, -2);
        equal(child.baseAbstract, -3);

    });
    
    test('Bad Inheritance', function ()
    {
        throws(function ()
        {
            BaseClass.extend({
                render: function ()
                {
                    return 'new render';
                }
            });
        }, 'Missing override');
    });

});

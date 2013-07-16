var _                  = require('underscore');
var IHandleChildObject = require('./IHandleChildObject');
var typedef            = require('typedef');

module.exports = RxParser = typedef

// RoboXML aka Rx parser
.class('RxParser') .define({

    __constructor__: function()
    {
    },

    // Given an XML node, return an Object that we've made
    parse: function(node)
    {
        // text node
        if (!node.name)
            return node;

        var obj = this.createObjFromNode(node);

        // Add all children to the node according to how it wants to add stuff.
        var _this = this;
        _(node.childs).each(function(child) {
            var o = _this.parse(child);

            // Need to add to the object somehow. We let the object decide how
            // it gets added when we through stuff at it via handleChildObject
            if (typedef.is(obj, IHandleChildObject))
                obj.handleChildObject(o);

        });

        return obj;
    },

    // Given an XML node, instantiate an object and initialize all the
    // information
    createObjFromNode: function(node)
    {
        var obj;

        // Attempt to load it from typedef
        var T = typedef.global[node.name];

        // assume it is a HTML DOM element
        if (!T) {
            obj = document.createElement(node.name);
        } else {
            obj = new T();
        }

        // Attributes onto the object
        _(node.attrib).each(function(value, key) {

            // namespace
            if (key === 'xmlns') {

            } else {
                obj[key] = value;
            }
        });

        return obj;
    }

});

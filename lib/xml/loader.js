var _ = require('underscore');

module.exports = loader =

// RoboXML aka Rx parser
function(node, _opts)
{
    // text node
    if (!node.fqcn)
        return node;

    var obj = {};

    if (node.ctor && _opts)
        obj = new node.ctor(_opts);
    else if (node.ctor)
        obj = new node.ctor();

    // Attributes onto the object
    _(node.attrib).each(function(value, key) {
        obj[key] = value;
    });

    // Add all children to the node according to how it wants to add stuff.
    _(node.nodes).each(function(child) {
        var o = loader(child);

        // Need to add to the object somehow. We let the object decide how
        // it gets added when we through stuff at it via handleChildObject
        if (node.ctor) {
            var prop = _(node.ctor.__signature__).each(function(info, prop) {
                if (info.decorations.CONTENTPROPERTY)
                    obj[prop] = o;
            });
        }


    });

    return obj;
};

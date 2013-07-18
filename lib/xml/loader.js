var _       = require('underscore');
var Binding = require('../event/Binding');

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
        var m = value.match(/^\s*{\s*Binding\s+(.*)\s*}\s*$/);
        if (m) {
            obj.addBinding(key, m[1]);
        } else {
            obj[key] = value;
        }
    });

    _(node.nodes).each(function(child) {
        var o = loader(child);

        if (node.ctor) {
            var prop = _(node.ctor.__signature__).each(function(info, prop) {
                if (info.decorations.CONTENTPROPERTY)
                    obj[prop] = o;
            });
        }

    });

    return obj;
};

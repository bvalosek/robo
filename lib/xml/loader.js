var _         = require('underscore');
var Binding   = require('../event/Binding');
var View      = require('../view/View');
var ViewGroup = require('../view/ViewGroup');

var XHTML_NS = 'http://www.w3.org/1999/xhtml';

module.exports = loader =

// RoboXML aka Rx parser
function(node, _opts, lastViewGroup)
{
    if (!node.fqcn)
        return ''+node;

    var obj = {};
    var T   = node.ctor;

    if (T && _opts)
        obj = new T(_opts);
    else if (T)
        obj = new T();
    else if (node.fqcn.substring(0,28) == XHTML_NS)
        obj = document.createElement(node.fqcn.substring(29));

    var contentProp;
    if (T) {
        addRoboNode(obj, node);
        _(T.__signature__).each(function(info, prop) {
            if (info.decorations.CONTENTPROPERTY)
                contentProp = prop;
        });

        if (typedef.is(obj, ViewGroup))
            lastViewGroup = obj;
    }

    _(node.nodes).each(function(child) {
        var o = loader(child, null, lastViewGroup);

        // Parent is view
        if (T) {
            obj[contentProp] = o;

        // (parenet is dom) and adding string
        } else if (_(o).isString()) {
            obj.innerText = o;

        // (parent is dom) and adding view
        } else if (child.ctor) {
            obj.appendChild(o.element);
            lastViewGroup.trackView(o);

        // (parent is dom) and adding dom
        } else {
            obj.appendChild(o);
        }

    });

    return obj;
};

function addRoboNode(obj, node)
{
    _(node.attrib).each(function(value, key) {
        var m = value.match(/^\s*{\s*Binding\s+(.*)\s*}\s*$/);
        if (m) {
            obj.addBinding(key, m[1]);
        } else {
            obj[key] = value;
        }
    });

}

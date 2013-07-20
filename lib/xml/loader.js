var _          = require('underscore');
var Binding    = require('../event/Binding');
var View       = require('../view/View');
var ViewGroup  = require('../view/ViewGroup');
var Collection = require('../model/Collection');
var typedef    = require('typedef');

var XHTML_NS = 'http://www.w3.org/1999/xhtml';

module.exports = loader =

// RoboXML aka Rx parser
function(node, _opts, lastViewGroup)
{
    if (!node.fqcn)
        return ''+node;

    var obj = {};
    var T   = node.ctor;

    // Instantiate the object if we have one, or create a DOM node if its from
    // XHTML, or an empty array to push attibute nodes into
    if (T && _opts)
        obj = new T(_opts);
    else if (T)
        obj = new T();
    else if (node.fqcn.substring(0,28) == XHTML_NS)
        obj = document.createElement(node.fqcn.substring(29));
    else if (node.fqcn == 'attrib')
        obj = [];

    // If we've instantiated something, see if it has a content prop and track
    // the view group as we decend to make sure and add stuff to if we need to
    if (typedef.is(obj, ViewGroup))
        lastViewGroup = obj;

    _(node.attrib).each(function(value, key) {
        var attr = loader(value);

        if (_(attr).isString()) {
            var m = value.match(/^\s*{\s*Binding\s+(.*)\s*}\s*$/);
            if (m) {
                obj.addBinding(key, m[1]);
            } else {
                handleProp(obj, key, value);
            }
        } else {
            _(attr).each(function(a) { handleProp(obj, key, a); });
        }
    });

    // Add children, either content, collection, or an attribute
    _(node.nodes).each(function(child) {
        var o = loader(child, null, lastViewGroup);

        // if parent is an attribute, dont worry, we are forwarding the nodes
        // directly
        if (node.fqcn == 'attrib') {
            obj.push(o);

        // Parent is a robo thing, we have to know how to add it to object,
        // thus the content prop. If this is an attribute child, then
        } else if (T) {
            handleProp(obj, undefined, o);

        // (parenet is dom) and adding string
        } else if (_(o).isString()) {
            obj.innerText = o;

        // (parent is dom) and adding view. Need to append to where we are in
        // visual tree, also add to the latest visual group managager
        } else if (child.ctor) {
            obj.appendChild(o.element);
            lastViewGroup.trackView(o);

        // (parent is dom) and adding dom, just put it
        } else {
            obj.appendChild(o);
        }

    });

    return obj;
};

// Given an object and key, figure out if we want to do an assign or push/add
function handleProp(obj, key, value)
{
    // have to infer the key to use
    if (key === undefined) {

        // Collection means just use 'add'
        if (typedef.is(obj, Collection))
            obj.add(value);

        var contentProp;
        _(typedef.signature(obj.constructor)).each(function(info, key) {
            if (info.decorations.CONTENTPROPERTY)
                contentProp = key;
        });

        if (contentProp) {
            obj[contentProp] = value;
        }

    } else {
        if (typedef.is(obj[key], Collection))
            obj[key].add(value);
        else
            obj[key] = value;

    }
}

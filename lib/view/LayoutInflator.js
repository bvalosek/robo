var _         = require('underscore');
var typedef   = require('typedef');
var UiElement = require('./UiElement');
var Layout    = require('./Layout');

module.exports = LayoutInflator = typedef

// Used for converting XML into an acutal thing
.class('LayoutInflator') .define({

    __constructor__: function()
    {
        this.domNode = null;
        this.xmlNode = null;
    },

    __fluent__setDomNode: function(node)
    {
        this.domNode = node;
        this.layout  = new Layout({ element: this.domNode });
        return this;
    },

    __fluent__setLayoutResource: function(res)
    {
        this.xmlNode = res;
        return this;
    },

    __fluent__inflate: function(node, dom)
    {
        node = node || this.xmlNode;
        dom  = dom || this.domNode || document.createDocumentFragment();

        // text node
        if (!node.name) {
            dom.innerText = node;
            return;
        }

        // Create the element with we're we at in the tree. If we get null
        // back, it means no DOM element, but we should continue to descend
        // with the children (ie a grouping node)
        var el = this.createElementFromNode(node) || dom;

        if (el !== dom)
            dom.appendChild(el);

        var _this = this;
        _(node.childs).each(function(child) {
            _this.inflate(child, el);
        });

        // The end
        if (node === this.xmlNode)
            console.log(this.layout.bindings);

        return this.layout;
    },

    // Given an XML node, create everything this layout will need for the
    // control and return the DOM elemenet for the inflator
    createElementFromNode: function(node)
    {
        var isRobo = node.name.substring(0,5) === 'robo:';

        // Create the robo control OR just create an element
        var el;
        var target;
        if (isRobo) {
            // If we don't want to create an element (not a DOM node, ie), then
            // return a null element here
            return null;
        } else {
            el     = document.createElement(node.name);
            target = el;
        }

        // Check out all the stuff and add it
        var _this = this;
        _(node.attrib).each(function(value, key) {
            if (!_this.parseBindings(target, key, value))
                target[key] = value;
        });

        return el;
    },

    // Give a binding string "s", setup bindings. Returns falsey if we don't
    // end up binding anything
    parseBindings: function(target, targetProp, s)
    {
        var info = s.match(/{\s*Binding\s+(.*)}\s*$/);

        if (!info)
            return false;
        info = info[1];

        // Need to handle actual binding syntax here
        var sourceProp = info;

        var binding = new Binding().setTarget(target, targetProp);
        binding.prop = sourceProp;

        this.layout.bindings.push(binding);
        return true;
    },

});

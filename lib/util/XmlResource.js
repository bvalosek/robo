var typedef = require('typedef');
var _       = require('underscore');

module.exports = XmlResource = typedef.class('XmlResource').define({

    // give an XML-loaded resource, translate it roughly into a javascript
    // object. This ignores attributse and attempts to array-ify anything that
    // appears to be multiple items. This transformation is not isomorphic
    __static__flattenResource: function(xmlResource)
    {
        var addNode = function(node)
        {
            // if we've hit a root node
            if (node.childs.length == 1 && _(node.childs[0]).isString())
                return node.childs[0];

            // check to see if this is array-style or hash style
            var keys = {};
            var output = [];
            var arrayStyle = false;
            _(node.childs).each(function(c) {
                if (keys[c.name])
                    arrayStyle = true;

                keys[c.name] = true;
                output.push(addNode(c));
            });

            if (arrayStyle)
                return output;

            // If there are no duplicate keys
            output = {};
            _(node.childs).each(function(c) {
                output[c.name] = addNode(c);
            });

            return output;
        };

        return addNode(xmlResource);
    }

});

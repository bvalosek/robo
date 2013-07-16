module.exports = WithAttributeExtension = require('typedef')

// Interface for extending the XML parser with the ability to do cool stuff
// with stringly-type attributes
//
// <SomeElement attribute="{MyExt param1=Something, param2=somethingElse}" />
//
// Will call the handle method
.mixin('WithAttributeExtension') .define({

    // Operating on the obj, messing with the attribute key, with the options
    // provided. options may either be a single string or a hash of info
    handleAttributeExtension: function(obj, key, _options) {}

});

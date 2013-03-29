define(function(require, exports, module) {

    var compose = require('compose');

    var IOptionProvider = compose.defineMixin({

        // shape of options is [ {key: 'abc', value: 123}, { ... } ]
        __abstract__getOptions: undefined,

        __abstract__selectOption: undefined,

        __abstract__getSelectedOption: undefined,

        __virtual__getDefaultOption: function() {}

    });

    return IOptionProvider;
});

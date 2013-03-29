define(function(require, exports, module) {

    var OptionArray     = require('robo/controls/OptionArray');
    var IOptionProvider = require('robo/mixins/IOptionProvider');

    QUnit.module('IOptionProvider & friends');

    test('OptionArray implementation', function() {

        var options = new OptionArray([1, 2, 3]);

        strictEqual(options.is(IOptionProvider), true, 'OptionArray is IOptionProvider');

        deepEqual(options.getOptions(), {1:1,2:2,3:3}, 'OptionArray from array creates options correctly');

        options.selectOption(2);
        strictEqual(options.getSelectedOption(), 2, 'returns correct element after being set');

        options = new OptionArray({
            tx: 'Texas',
            fl: 'Florida',
            az: 'Arizona'
        });

        raises(function() { options.selectOption(123); }, 'chosing an invalid options throws error');
        options.selectOption('tx');
        equal(options.getSelectedOption(), 'Texas', 'correct option after being seelcted');

    });
});

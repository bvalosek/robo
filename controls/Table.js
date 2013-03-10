define(function(require, exports, module) {

    var Control        = require('../Control');
    var withControls   = require('../mixins/withControls');
    var CollectionView = require('robo/controls/CollectionView');
    var TableRow       = require('robo/controls/TableRow');

    var Table = Control.mixin(withControls).extend({

        constructor: function(opts)
        {
            Table.Super.call(this, { tagName: 'table' });

            this.setTemplate(require('text!./table.html'));

            this.collection = opts.collection;
        },

        render: function()
        {
            Table.Super.prototype.render.apply(this, arguments);
        }

    });

    return Table;
});

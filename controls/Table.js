define(function(require, exports, module) {

    var Control        = require('../Control');
    var withControls   = require('../mixins/withControls');
    var CollectionView = require('robo/controls/CollectionView');
    var TableRow       = require('robo/controls/table/TableRow');
    var _              = require('underscore');

    var Table = Control.mixin(withControls).extend({

        constructor: function(opts)
        {
            Table.Super.call(this, _(opts).extend({ tagName: 'table' }));

            this.setTemplate(require('text!./table/table.html'));

            this.collection = opts.collection;
        },

        __override__render: function()
        {
            Table.Super.prototype.render.apply(this, arguments);
        }

    });

    return Table;
});

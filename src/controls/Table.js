define(function(require, exports, module) {

    var Control        = require('../Control');
    var withControls   = require('../mixins/withControls');
    var CollectionView = require('robo/controls/CollectionView');
    var TableRow       = require('robo/controls/table/TableRow');
    var _              = require('underscore');

    var Table = Control.using(withControls).extend({

        __override__readonly__tagName: 'table',

        __constructor__Table: function(opts)
        {
            Table.Super.apply(this, arguments);

            this.setTemplate(require('text!./table/table.html'));

            this.collection = opts.collection;
        }

    });

    return Table;
});

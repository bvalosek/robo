define(function(require, exports, module) {

    var withControls   = require('../mixins/withControls');
    var TemplateView   = require('../view/TemplateView');
    var CollectionView = require('robo/controls/CollectionView');
    var TableRow       = require('robo/controls/table/TableRow');
    var _              = require('underscore');

    var Table = TemplateView.using(withControls).extend({
        __name__'Table',

        __override__readonly__tagName: 'table',

        __override__template: require('text!./table/table.html'),

    });

    return Table;
});

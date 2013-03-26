define(function(require, exports, module) {

    var ModelControl = require('./ModelControl');

    var ModelTable = ModelControl.extend({

        __override__template : require('text!./table/model-table.html'),
        __override__readonly__tagName : 'table',

        __constructor__ModelTable: function()
        {
            ModelTable.Super.apply(this, arguments);
        }

    });

    return ModelTable;
});

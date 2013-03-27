define(function(require, exports, module) {

    var ModelControl = require('./ModelControl');
    var Control      = require('../Control');
    var Model        = require('robo/Model');
    var Collection   = require('robo/Collection');

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

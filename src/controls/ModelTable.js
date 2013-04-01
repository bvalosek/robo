define(function(require, exports, module) {

    var _            = require('underscore');
    var Model        = require('robo/model/Model');
    var Collection   = require('robo/model/Collection');
    var TemplateView = require('robo/view/TemplateView');
    var withTemplate = require('../view/withTemplate');
    var ModelControl = require('./ModelControl');

    var ModelTable = ModelControl.using(withTemplate).extend({

        template : require('text!./table/model-table.html'),

        __override__readonly__tagName : 'table',

        __constructor__ModelTable: function()
        {
            ModelTable.Super.apply(this, arguments);
        }

    });

    return ModelTable;
});

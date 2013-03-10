define(function(require, exports, module) {

    var TemplateView = require('../TemplateView');

    var TableRow = TemplateView.extend({

        constructor: function()
        {
            TableRow.Super.call(this, { tagName: 'tr' });

            this.setTemplate(require('text!./table-row.html'));
        }

    });

    return TableRow;
});

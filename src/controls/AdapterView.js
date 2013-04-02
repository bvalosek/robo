define(function(require, exports, module) {

    var AdapterView = ViewGroup.extend({

        setAdapter: function(adapter)
        {
            this.stopListening(this.adapter);

            this.adapter = adapter;

            // need to listen to add here

        },

        init: function()
        {
            this.clearViews();
        },

    });

    return AdapterView;
});

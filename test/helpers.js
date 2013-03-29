define(function(require, exports, module) {

    var compose = require('compose');

    return {

        // if 2 arrays are equal, ignoring order
        sameArrays: function(a1, a2)
        {
            var i = _(a1).intersection(a2);
            return (a1.length == a2.length) && (a1.length == i.length);
        },

        // legit queeue
        Q: compose.defineClass({
            constructor: function() {
                this.d      = null;
                this.events = [];
            },

            push: function(x) {
                if (this.d) {
                    this.d.resolve(x);
                    this.d = null;
                    return;
                }

                this.events.push(x);
            },

            pop: function() {
                if (this.events.length !== 0) {
                    var e = this.events.splice(0,1)[0];
                    return new $.Deferred().resolve(e);
                }

                this.d = this.d || new $.Deferred();
                return this.d;
            },

            take: function(n) {
                var a = [];

                var s = new $.Deferred();
                var p = function(x) {
                    a.push(x);
                };

                for (var i = 0; i < n; i++) {
                    s.then(this.pop.bind(this)).then(p);
                }

                return s.resolve().then(function() { return a; });
            }
        })
    };

});

define(function(require) {

    var Model   = require('robo/Model');
    var $       = require('jquery');
    var compose = require('robo/compose');
    var helpers = require('./helpers');

    module('Model');

    test('change events on primative types', function() {

        var M = Model.extend({

            __attribute__number        : 1,
            __attribute__bool          : true,
            __attribute__string        : 'some val'

        });

        var m = new M();
        var q = new helpers.Q();
        m.on('all', function(e) { q.push(e); });

        m.number = 5;
        q.take(2).then(function(a) {
            strictEqual(helpers.sameArrays(a,
                ['change', 'change:number']), true,
                'setting number attribute triggers changes');
        });

        m.bool = false;
        q.take(2).then(function(a) {
            strictEqual(helpers.sameArrays(a,
                ['change', 'change:bool']), true,
                'setting bool attribute triggers changes');
        });

        m.string = 'asdfasdf';
        q.take(2).then(function(a) {
            strictEqual(helpers.sameArrays(a,
                ['change', 'change:string']), true,
                'setting string attribute triggers changes');
        });

    });

    test('access semantics on attributes', function() {
        var M = Model.extend({
            __attribute__readonly__ro: 1,
            __attribute__hidden__hidden: 2,
            __attribute__const__con: 3
        });

        var m = new M();
        var q = new helpers.Q();
        m.on('all', function(e) { q.push(e); });

        m.ro = 3;
        strictEqual(m.ro, 1, 'cannot change readonly attribute');
        raises(function() { m.con = 5; }, 'throw exception when changing const attribute');
        strictEqual(q.events.length, 0, 'no events fired when changing readonly or const attribute');
        deepEqual(m.toJSON(), { ro:1, con:3}, 'hidden attribute not exposed in model');
    });

    test('nested models via propigate annotation', function() {
        var M = Model.extend({
            __attribute__propigate__sub: null
        });

        var Sub = Model.extend({
            __attribute__name: 'sub module'
        });

        var m = new M();
        var q = new helpers.Q();
        m.on('all', function(e) { q.push(e); });

        m.sub = new Sub();
        q.take(2).then(function(a) {
            strictEqual(helpers.sameArrays(a,
                ['change', 'change:sub']), true,
                'setting a propigated member triggers change');
        });

        m.sub.name = '123';
        q.take(3).then(function(a) {
            strictEqual(helpers.sameArrays(a,
                ['change', 'sub:change', 'sub:change:name']), true,
                'setting a propigated members member triggers change');
        });

        var sub = m.sub;
        m.sub = null;
        q.take(2).then(function(a) {
            strictEqual(helpers.sameArrays(a,
                ['change', 'change:sub']), true,
                'clearing property triggers change');
        });

        sub.name = 'abcd';
        strictEqual(q.events.length, 0, 'changing disconnected model does not trigger event in parent');

    });

});

var WithEvents    = require('../../lib/event/WithEvents');
var WithDomEvents = require('../../lib/event/WithDomEvents');
var compose       = require('compose');
var _             = require('underscore');

// Create an eventable object that pipes things throug the DOM
var DomObject = compose
    .class('DomObject')
    .uses(WithEvents, WithDomEvents)
    .define({
        __constructor__: function(selector)
        {
            this.element = document.querySelector(selector);
        },
    });

// Normal eventable object
var EventObject = compose.class('EventObject').uses(WithEvents).define();

QUnit.module('Events - In the DOM');

test('on-element triggering', 1, function() {
    var EVENT = 'EVENT';
    var button1 = new DomObject('#button1');
    button1.on(EVENT, function() { ok(true); });
    button1.trigger(EVENT);
});

test('on-element trigger with DOM events', 2, function() {
    var button1 = new DomObject('#button1');
    button1.on('click', function() { ok(true); });
    $('#button1').click();
    button1.trigger('click');
});

test('bubbling up', 1, function() {
    var button1    = new DomObject('#button1');
    var container1 = new DomObject('#container1');
    container1.on('event', function() { ok(true); });
    button1.trigger('event');
});

test('bubbling up across non-bound DOM nodes', 1, function() {
    var container1 = new DomObject('#container1');
    container1.on('click', function() { ok(true); });
    $('#button1').click();
});


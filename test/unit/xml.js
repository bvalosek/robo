var R                = require('../R.js');
var RxParser         = require('../../lib/xml/RxParser');
var ContentControl   = require('../../lib/control/ContentControl');
var ObservableObject = require('../../lib/event/ObservableObject');
var typedef          = require('typedef');

QUnit.module('XML Parsing');

var SampleThing = typedef
.class('SampleThing') .extends(ObservableObject) .define({
    __observable__prop: ''
});

test('Basic ContentControl stuff', function() {
    var obj = new RxParser()
        .parse(R('xml/content.xml'));

    ok(typedef.is(obj, ContentControl), 'ContentControl created');
});

test('Nested content control', function() {
    var obj = new RxParser()
        .parse(R('xml/content-with-sample.xml'));

    ok(typedef.is(obj.content, SampleThing), 'ContentControl created');
});

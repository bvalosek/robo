var R              = require('../R.js');
var RxParser       = require('../../lib/xml/RxParser');
var ContentControl = require('../../lib/control/ContentControl');
var typedef        = require('typedef');

QUnit.module('XML Parsing');

test('Basic ContentControl stuff', function() {

    var xml = R('xml/content.xml');

    var obj = new RxParser().parse(xml);

    ok(typedef.is(obj, ContentControl), 'ContentControl created');

});

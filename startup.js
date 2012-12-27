define(function(require) {

    var html = require('text!./res/startup.html');

    console.log('loading app...');

    var body = document.getElementsByTagName('body')[0];
    body.innerHTML = html;
});

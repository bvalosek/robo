define(function(require) {

    // throw something up on the screen whilst we start the rest of the app
    var html = require('text!./res/startup.html');
    var body = document.getElementsByTagName('body')[0];

    body.innerHTML = html;

});

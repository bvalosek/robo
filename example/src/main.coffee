HomeViewModel = require './HomeViewModel.coffee'
Binding       = require 'robo/observable/Binding'
Log           = require 'robo/util/Log'
domReady      = require 'domready'

Log.w 'App started'

domReady ->
  global.vm = new HomeViewModel
  global.b = new Binding()
    .setSource(vm.person, 'fullName')
    .setTarget(document.body, 'innerHTML')


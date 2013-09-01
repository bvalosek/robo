domReady       = require 'domready'

Binding        = require 'robo/observable/Binding'
Log            = require 'robo/util/Log'
ContentControl = require 'robo/control/ContentControl'
Button         = require 'robo/control/Button'
Label          = require 'robo/control/Label'
Window         = require 'robo/view/Window'

HomeViewModel  = require './HomeViewModel.coffee'
Person         = require './Person.coffee'

Log.w 'App started'

domReady ->
  global.vm     = new HomeViewModel
  global.button = new Button
  global.label  = new Label
  global.body   = new Window document.body
  global.me     = new Person
  me.firstName  = 'Brandon'
  me.lastName   = 'Valosek'

  button.addBinding 'content', 'person.firstName'
  label.addBinding 'content', 'person.fullName'

  body.views.add label
  body.views.add button
  body.dataContext = vm



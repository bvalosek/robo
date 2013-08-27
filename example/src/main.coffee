Log           = require 'robo/util/Log'
HomeViewModel = require './HomeViewModel.coffee'

Log.d 'App started'

global.vm = new HomeViewModel


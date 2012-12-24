# robo makefile
BASE_URL = www/


# misc
DATE=$(shell date +%I:%M%p)

default : lint

lint : 
	@find ${BASE_URL}lib/robo -iname "*.js" -print0 | xargs -0 jshint
	@echo "Passed JSHint with flying colors. Great code!"

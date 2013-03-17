# robo make file

default : build

# generate a "compose.min.js" file that expects underscore to be global
build-compose : lint
	@echo "Compiling compose.js..."
	@r.js -o baseUrl=. \
		name="compose.js" \
		out="compose.min.js" \
		paths.underscore="../../vendor/underscore" \
		exclude="underscore"

lint :
	@find ${BASE_URL} -iname "*.js" \
		-print0 | xargs -0 jshint
	@echo "Passed JSHint with flying colors. Great code!"

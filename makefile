# robo makefile
BASE_URL = www/
OUTPUT_DIR = www-built/

# misc
DATE=$(shell date +%I:%M%p)

default : lint

build : greet clean lint assets compile extra
	@echo -e "Robo lib successfully built at ${DATE}.\n"

compile :
	@echo "Compiling and optimzing app..."
	@r.js -o mainConfigFile=${BASE_URL}main.js baseUrl=${BASE_URL} out=${OUTPUT_DIR}main.built.js

extra :
	@echo -n "Adding in build extras"
	@cp -R build/* ${OUTPUT_DIR}
	@echo "easy."

assets :
	@echo -n "Copying assets..."
	@mkdir -p ${OUTPUT_DIR}assets
	@cp -R ${BASE_URL}assets/* ${OUTPUT_DIR}/assets
	@echo "got em."

greet :
	@echo -e "\nBuilding Robo lib..."

clean :
	@echo -n "Cleaning..."
	@rm -rf ${OUTPUT_DIR}
	@echo "Crisp."

lint :
	@find ${BASE_URL}lib/robo -iname "*.js" -print0 | xargs -0 jshint
	@echo "Passed JSHint with flying colors. Great code!"

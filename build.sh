#!/bin/bash
R='\033[0;31m'
G='\033[0;32m'
B='\033[0;96m'

# ------------------------------------------ #
# Vars
# ------------------------------------------ #
ROOT=$(echo $(pwd) | sed 's|/c/|C:/|')

NAME='release' # slug
THEME='default' # slug
TEST=TRUE
VENDOR=TRUE
COMPOSER=TRUE
GENERATE=TRUE

APP="${ROOT}/.build/${NAME}"
ASSET="${APP}/public/assets"

# ------------------------------------------ #
# Checking toolkits
# ------------------------------------------ #
echo -e "${B}Checking toolkits..."

if ! terser --version terser &> /dev/null
then
	echo -e "${B}Installing global terser package..."
    npm install terser -g
fi

if ! uglifyjs -v uglifyjs &> /dev/null
then
	echo -e "${B}Installing global uglify-js package..."
    npm install uglify-js -g
fi

if ! uglifycss --version uglifycss &> /dev/null
then
	echo -e "${B}Installing global uglify-css package..."
    npm install uglifycss -g
fi

if ! combine-files combine-files &> /dev/null
then
	echo -e "${B}Installing global combine-files package..."
    npm install combine-files -g
fi

if ! json --version json &> /dev/null
then
	echo -e "${B}Installing global Json parser..."
    npm install -g json
fi

sleep 2
clear

# ------------------------------------------ #
# Copying release files
# ------------------------------------------ #
echo -e "${G}Copying release files..."

if [ -d "${APP}" ]; then
    rm -rf "${APP}"
fi
rm -f "${APP}-*.zip"

mkdir "${APP}"

cp "${ROOT}/.htaccess" "${APP}/.htaccess"
cp "${ROOT}/index.php" "${APP}/index.php"
cp -r "${ROOT}/public" "${APP}/public"

if [ "$COMPOSER" = "TRUE" ]; then
   cp "${ROOT}/composer.json" "${APP}/composer.json"
fi

if [ "$GENERATE" = "TRUE" ]; then
cp "${ROOT}/generate.php" "${APP}/generate.php"
cp "${ROOT}/generate.sh" "${APP}/generate.sh"
fi

if [ "$TEST" = "TRUE" ]; then
    cp "${ROOT}/init.sh" "${APP}/init.sh"
    cp "${ROOT}/test.sh" "${APP}/test.sh"
    cp "${ROOT}/test.php" "${APP}/test.php"
fi

if [ "$VENDOR" = "TRUE" ];
    then
        cp -r "${ROOT}/App" "${APP}/App"
    else
        mkdir "${APP}/App"
        cp -r "${ROOT}/App/Controllers" "${APP}/App/Controllers"
        cp -r "${ROOT}/App/Helpers" "${APP}/App/Helpers"
        cp -r "${ROOT}/App/Models" "${APP}/App/Models"
        cp -r "${ROOT}/App/Modules" "${APP}/App/Modules"
        cp -r "${ROOT}/App/Storage" "${APP}/App/Storage"
        cp -r "${ROOT}/App/Views" "${APP}/App/Views"
        cp "${ROOT}/App/App.php" "${APP}/App/App.php"
        cp "${ROOT}/App/.htaccess" "${APP}/App/.htaccess"
fi

sleep 2
clear

# ------------------------------------------ #
# Testing release
# ------------------------------------------ #
if [ "$TEST" = "TRUE" ]; then
    bash "${APP}/init.sh"
    bash "${APP}/test.sh"
    sleep 2
fi

# ------------------------------------------ #
# Composer update (production)
# ------------------------------------------ #
if [ "$COMPOSER" = "TRUE" ]; then
    echo -e "${G}Composer update (production)..."

    cd "${APP}"
    composer clearcache
    composer validate
    composer update --no-dev -o

    sleep 2
    clear
fi

# ------------------------------------------ #
# Generate production files
# ------------------------------------------ #
if [ "$GENERATE" = "TRUE" ]; then
    echo -e "${G}Generate production files..."

    bash "${APP}/generate.sh"

    sleep 2
    clear
fi

# ------------------------------------------ #
# Copy shared vendors (icons)
# ------------------------------------------ #
# echo -e "${G}Copy shared vendors (icons)..."

# TMP="${ASSET}/vendor"
# DIST="${ASSET}/front/theme/${THEME}/css"

# cp "${TMP}/example/example.css" "${DIST}/example.css"

# sleep 2
# clear

# ------------------------------------------ #
# Combine CSS files
# ------------------------------------------ #
echo -e "${G}Combine CSS files..."

# cd "${TMP}"
# combine-files . style.min.css
# find . -type f -not -name "style.min.css" -delete

TMP="${ASSET}/front/theme/${THEME}/css/"
# cp "${ASSET}/example/example.min.css" "${TMP}example.min.css"

FILES=(
    "style.css"
    "custom.css"
    "icons.min.css"
    # "example.min.css"
)
FILES=$(printf "%s," "${FILES[@]/#/$TMP}")
FILES=${FILES%,}

combine-files "${FILES}" "${TMP}/style.min.css"

sleep 2
clear

# ------------------------------------------ #
# Combine JS files
# ------------------------------------------ #
echo -e "${G}Combine JS files..."

TMP="${ASSET}/vendor/"
FILES=(
    "bootstrap/bootstrap.bundle.min.js"
    "jquery/jquery.min.js"
    "vanille/VanillePlugin.min.js"
    # "example/example.min.js"
)
FILES=$(printf "%s," "${FILES[@]/#/$TMP}")
FILES=${FILES%,}

combine-files "${FILES}" "${TMP}/all.min.js"

sleep 2
clear

# ------------------------------------------ #
# Minify CSS files
# ------------------------------------------ #
echo -e "${G}Minify CSS files..."

TMP="${ASSET}/front/theme/${THEME}/css"
uglifycss "${TMP}/style.min.css" --output "${TMP}/style.min.css"

TMP="${ASSET}/admin/css"
uglifycss "${TMP}/style.css" --output "${TMP}/style.min.css"

sleep 2
clear

# ------------------------------------------ #
# Minify JS files
# ------------------------------------------ #
echo -e "${G}Minify JS files..."

TMP="${ASSET}/front/theme/${THEME}/js"
uglifyjs "${TMP}/main.js" -c -m --output "${TMP}/main.min.js"

TMP="${ASSET}/admin/js"
uglifyjs "${TMP}/main.js" -c -m --output "${TMP}/main.min.js"
uglifyjs "${TMP}/login.js" -c -m --output "${TMP}/login.min.js"

# TMP="${ASSET}/vendor"
# uglifyjs "${TMP}/all.min.js" -c -m --output "${TMP}/all.min.js"

sleep 2
clear

# ------------------------------------------ #
# Compile language files
# ------------------------------------------ #
TMP="${APP}/App/Storage/translation"
echo -e "${G}Compile language files [EN]..."

msgfmt -o "${TMP}/en.mo" "${TMP}/en.po"

sleep 2
clear

# ------------------------------------------ #
# Remove cache, logs, backups
# ------------------------------------------ #
echo -e "${R}Remove cache, logs, backups..."

TMP="${APP}/App/Storage"
rm -rf "${TMP}/cache/view"
rm -rf "${TMP}/cache/temp"
rm -rf "${TMP}/logs/core/*"
rm -rf "${TMP}/logs/database/*"
rm -rf "${TMP}/upload/backups/*.zip"
rm -rf "${TMP}/upload/backups/*.backup"

sleep 2
clear

# ------------------------------------------ #
# Removing development files
# ------------------------------------------ #
echo -e "${R}Removing development files..."

find "${APP}" -type f -name "*.bak.*" -exec rm -f {} \;
find "${APP}" -type f -name "*.bak" -exec rm -f {} \;
find "${APP}" -type f -name "*.sh" -exec rm -f {} \;
find "${APP}" -type f -name "*.md" -exec rm -f {} \;
find "${APP}" -type f -name "phpunit.*" -exec rm -f {} \;
find "${APP}" -type f -name ".gitignore" -exec rm -f {} \;
find "${APP}" -type f -name ".editorconfig" -exec rm -f {} \;
find "${APP}" -type f -name ".gitattributes" -exec rm -f {} \;
find "${APP}" -type f -name ".codeclimate.yml" -exec rm -f {} \;
find "${APP}" -type f -name ".travis.yml" -exec rm -f {} \;
find "${APP}" -type f -name "composer.json" -exec rm -f {} \;
find "${APP}" -type f -name "composer.lock" -exec rm -f {} \;
find "${APP}" -type f -name "CHANGELOG" -exec rm -f {} \;
find "${APP}" -type f -name "README" -exec rm -f {} \;
find "${APP}" -type f -name "README.rst" -exec rm -f {} \;
find "${APP}" -type f -name "LICENSE.txt" -exec rm -f {} \;
find "${APP}" -type f -name "LICENSE" -exec rm -f {} \;
find "${APP}" -type f -name "LICENCE" -exec rm -f {} \;
find "${APP}" -type f -name "installed.json" -exec rm -f {} \;
find "${APP}" -type f -name "_config.yml" -exec rm -f {} \;
find "${APP}" -type f -name ".php_cs.dist" -exec rm -f {} \;
find "${APP}" -type f -name ".php-cs-fixer.dist.php" -exec rm -f {} \;

rm -f "${APP}/test.php"
rm -f "${APP}/generate.php"
rm -f "${APP}/App/Storage/config/db.ini" # Legacy

rm -f "${ASSET}/front/theme/${THEME}/css/style.css"
rm -f "${ASSET}/front/theme/${THEME}/css/custom.css"
rm -f "${ASSET}/front/theme/${THEME}/css/icons.min.css"
rm -f "${ASSET}/front/theme/${THEME}/js/main.js"
rm -f "${ASSET}/admin/css/style.css"
rm -f "${ASSET}/admin/js/main.js"
rm -f "${ASSET}/admin/js/login.js"
rm -rf "${ASSET}/vendor/jquery"
rm -rf "${ASSET}/vendor/bootstrap"
rm -rf "${ASSET}/vendor/vanille"
# rm -rf "${ASSET}/example/example"

sleep 2
clear

# ------------------------------------------ #
# Update global config
# ------------------------------------------ #
echo -e "${G}Update global config..."

TMP="${APP}/App/Storage/config"
DEBUGON='"debug": true'
DEBUGOFF='"debug": false'

cp "${TMP}/global.json" "${TMP}/global.tmp"
sed "s/${DEBUGON}/${DEBUGOFF}/g" "${TMP}/global.tmp" > "${TMP}/global.json"
rm "${TMP}/global.tmp"

sleep 2
clear

# ------------------------------------------ #
# Parsing version
# ------------------------------------------ #
echo -e "${G}Parsing version from global.json..."

TMP="${APP}/App/Storage/config/global.json"
VERSION=`cat ${TMP}`
VERSION=`echo ${VERSION} | json version`

sleep 2
clear

# ------------------------------------------ #
# Generating release archive
# ------------------------------------------ #
echo -e "${G}Generating release archive [${VERSION}]..."

cd "${ROOT}/.build"
zip "${NAME}-${VERSION}.zip" -r "${NAME}"
rm -rf "${NAME}"

sleep 2
clear

# ------------------------------------------ #
# Done
# ------------------------------------------ #
echo -e "${B}Done! press [Enter]"
read PAUSE

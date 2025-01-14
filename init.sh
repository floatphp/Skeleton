#!/bin/bash
R='\033[0;31m'

echo -e "${G}Composer update (dev)..."
composer clearcache
composer update

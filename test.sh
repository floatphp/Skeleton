#!/bin/bash
R='\033[0;31m'
G='\033[0;32m'

# ------------------------------------------ #
# Testing Framework
# ------------------------------------------ #
echo -e "${R}Testing Framework (Unit)..."
echo -e "${G}"
./App/vendor/bin/phpunit --bootstrap ../../../test.php ./App/vendor/floatphp/kernel/tests

echo "";
sleep 2

# ------------------------------------------ #
# Testing App
# ------------------------------------------ #
echo -e "${R}Testing App (Unit)..."
echo -e "${G}"
./App/vendor/bin/phpunit --bootstrap ./test.php ./tests

echo "";
sleep 2

# ------------------------------------------ #
# Testing App (Stress)
# ------------------------------------------ #
echo -e "${R}Testing App (Stress)..."
echo -e "${G}"
./App/vendor/bin/phpunit --bootstrap ./test.php ./tests/stress

echo "";
sleep 2

# ------------------------------------------ #
# Done
# ------------------------------------------ #
echo -e "${B}Done! press [Enter]"
read PAUSE

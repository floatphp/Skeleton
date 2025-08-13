#!/usr/bin/php
<?php
/**
 * @author     : Jakiboy
 * @package    : FloatPHP Skeleton App
 * @version    : 1.5.x
 * @copyright  : (c) 2017 - 2025 Jihad Sinnaour <me@jihadsinnaour.com>
 * @link       : https://floatphp.com
 * @license    : MIT
 *
 * This file if a part of FloatPHP Framework.
 */

namespace App;

use FloatPHP\Classes\Server\System;

// Init Path
$root = __DIR__;
include "{$root}/App/App.php";

// System configuration
System::setTimeLimit(seconds: 0);
System::setMemoryLimit(value: '-1');

// Check CLI
if ( !System::isCli() ) exit();

// Init App
App::init();

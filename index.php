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

// Init Path
$root = __DIR__;
include "{$root}/App/App.php";

// Init App
App::start(config: [
	'--disable-setup'      => false,
	'--enable-maintenance' => false,
	'--disable-database'   => false
]);

// Nothing to run here!

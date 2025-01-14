<?php
/**
 * @author     : Jakiboy
 * @package    : FloatPHP Skeleton App
 * @version    : 1.4.x
 * @copyright  : (c) 2017 - 2024 Jihad Sinnaour <mail@jihadsinnaour.com>
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
	'--enable-maintenance' => false,
	'--disable-database'   => false,
	'--default-lang'       => 'en'
]);

// Nothing to run here!

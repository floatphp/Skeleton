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

use FloatPHP\Kernel\Core;
use FloatPHP\Classes\Filesystem\Stringify;
use FloatPHP\Helpers\Framework\Debugger;

final class App
{
	/**
	 * @access private
	 * @var bool $initialized
	 */
	private static $initialized = false;

	/**
	 * Register app autoloader.
	 *
	 * @access private
	 */
	private function __construct()
	{
		global $__APP__;
		$__APP__ = __DIR__;

		// Include dependencies
		if ( !file_exists($autoload = "{$__APP__}/vendor/autoload.php") ) {
			exit(__CLASS__ . ': Autoload required');
		}

		require_once $autoload;
		spl_autoload_register(callback: [__CLASS__, 'autoload']);

		// Finish initialization
		static::$initialized = true;
	}

	/**
	 * Unregister app autoloader.
	 */
	public function __destruct()
	{
		spl_autoload_unregister(callback: [__CLASS__, 'autoload']);
	}

	/**
	 * Autoloader method.
	 * 
	 * @access private
	 * @param string $class
	 * @return void
	 */
	private function autoload(string $class) : void
	{
		$namespace = __NAMESPACE__;
		if ( strpos(haystack: $class, needle: "{$namespace}\\") === 0 ) {

			$class = Stringify::remove(string: "{$namespace}\\", subject: $class);
			$class = Stringify::replace(search: '\\', replace: '/', subject: $class);

			$namespace = Stringify::replace(
				search: ['\\', '_'],
				replace: ['/', '-'],
				subject: $namespace
			);

			$class = Stringify::formatPath(
				path: "{$namespace}/{$class}.php"
			);

			require_once $class;
		}
	}

	/**
	 * Initialize framework.
	 *
	 * @access public
	 * @return void
	 */
	public static function init() : void
	{
		if ( !static::$initialized ) {
			new static;
		}
	}

	/**
	 * Start framework core.
	 *
	 * @access public
	 * @param array $config
	 * @return void
	 */
	public static function start(array $config = []) : void
	{
		if ( !static::$initialized ) {
			self::init();
			Debugger::init();
			new Core($config);
			Debugger::setExecutionTime();
		}
	}
}

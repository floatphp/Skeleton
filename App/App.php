<?php
/**
 * @author    : JIHAD SINNAOUR
 * @package   : FloatPHP
 * @subpackage: App Component
 * @version   : 1.0.0
 * @category  : PHP framework
 * @copyright : (c) JIHAD SINNAOUR <mail@jihadsinnaour.com>
 * @link      : https://www.floatphp.com
 * @license   : MIT License
 */

namespace App;

class App
{
	public function __construct()
	{
		include( __DIR__ . '/vendor/autoload.php' );
		self::register();
		new \floatPHP\Kernel\Kernel;
	}

	/**
	 * @param $class
	 * @return void
	 */
	private function autoload($class)
	{
	    if (strpos($class, __NAMESPACE__ . '\\') === 0)
	    {
	        $class = str_replace(__NAMESPACE__ . '\\', '', $class);
	        $class = str_replace('\\', '/', $class);
	        require __NAMESPACE__.'/' . $class . '.php';
	    }
	}

	/**
	 * @param void
	 * @return void
	 */
	private function register()
	{
	    spl_autoload_register(array(__CLASS__, 'autoload'));
	}
	
	/**
	 * @param void
	 * @return void
	 */
	public function unregister()
	{
		spl_autoload_unregister(array(__CLASS__, 'autoload'));
	}
}

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

declare(strict_types=1);

namespace App\Helpers\io;

use FloatPHP\Classes\Filesystem\Stringify;
use FloatPHP\Classes\Http\Server;
use FloatPHP\Classes\Server\Date;

final class InputIO
{
	use \FloatPHP\Kernel\TraitConfiguration;

	/**
	 * @access private
	 * @var string $path
	 * @var array $data
	 * @var array $default
	 * @var array $values
	 * @var array $inputs
	 */
	private $path;
	private $data = [];
	private $default = [];
	private $values = [];
	private $inputs = [];

	/**
	 * Init.
	 */
	public function __construct()
	{
		$this->path = $this->getUploadPath(sub: 'inputs');
	}

	/**
	 * Set data.
	 *
	 * @access public
	 * @param string $name
	 * @param array $values
	 * @return object
	 */
	public function set(string $name, array $values = []) : self
	{
		$default = ($name == 'global') ? 'default' : 'global';

		$io = new ConfigIO();

		$this->default = $io->get($default);
		$this->data = $io->get($name);

		$this->values = $values;

		$file = "{$this->path}/{$name}.json";
		if ( $this->isFile($file) ) {
			$this->inputs = $this->parseJson($file, true) ?: [];
		}

		return $this;
	}

	/**
	 * Get inputs.
	 *
	 * @access public
	 * @return array
	 */
	public function get() : array
	{
		return $this->inputs ?: [];
	}
}

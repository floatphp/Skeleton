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

declare(strict_types=1);

namespace App\Helpers\inc;

use FloatPHP\Helpers\Filesystem\Loader;

final class Api
{
	/**
	 * Autoload Webservice.
	 *
	 * @inheritdoc
	 */
	public static function i(string $version, string $name, ...$args) : mixed
	{
		return (new Loader())->i("api/v{$version}", $name, ...$args);
	}
}

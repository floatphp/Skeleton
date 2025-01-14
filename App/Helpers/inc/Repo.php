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

namespace App\Helpers\inc;

use FloatPHP\Helpers\Filesystem\Loader;

final class Repo
{
	/**
	 * Autoload Repository.
	 *
	 * @inheritdoc
	 */
	public static function i(string $name, ...$args) : mixed
	{
		return (new Loader())->i('repo', "{$name}repo", ...$args);
	}
}

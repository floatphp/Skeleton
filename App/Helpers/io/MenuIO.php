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

use \FloatPHP\Helpers\Html\Menu;

/**
 * Menu helper.
 */
final class MenuIO
{
	/**
	 * Get static generated menu.
	 *
	 * @inheritdoc
	 */
	public static function get() : array
	{
		return (new Menu())->prepare()->generate();
	}
}

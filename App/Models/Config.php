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

namespace App\Models;

use FloatPHP\Kernel\Model;

class Config extends Model
{
	/**
	 * @access protected
	 */
	protected $table = 'config';
	protected $key = 'configId';
}

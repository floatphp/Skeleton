<?php
/**
 * @author     : Jakiboy
 * @package    : FloatPHP Skeleton App
 * @version    : 1.1.x
 * @copyright  : (c) 2017 - 2024 Jihad Sinnaour <mail@jihadsinnaour.com>
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

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

namespace App\Helpers\ws\v2;

// use App\Helpers\toolkits\http\Validator;
use FloatPHP\Classes\Http\Response;

final class Main
{
	/**
	 * @inheritdoc
	 */
	public static function index() : void
	{
		// Validator::hasNothing();
		Response::set('Generator API v2', [
			'version' => '2.0'
		], 'info');
	}
}

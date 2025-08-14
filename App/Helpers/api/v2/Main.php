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

namespace App\Helpers\api\v2;

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

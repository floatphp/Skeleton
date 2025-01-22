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

use FloatPHP\Classes\Security\Encryption;
use FloatPHP\Helpers\Framework\Configurator;

/**
 * Auth helper.
 */
final class AuthIO
{
	/**
	 * Generate token.
	 *
	 * @access public
	 * @param string $user
	 * @param string $pswd
	 * @return string
	 */
	public static function generateToken(string $user, string $pswd) : string
	{
		$data = ['user' => $user, 'pswd' => $pswd];

		$config = new Configurator();
		$secret = $config->reflect()->api->secret;

		$cryptor = new Encryption($data, $secret);
		return $cryptor->setPrefix()->encrypt();
	}

	/**
	 * Parse token.
	 *
	 * @access public
	 * @param string $token
	 * @return array
	 */
	public static function parseToken(string $token) : array
	{
		$config = new Configurator();
		$secret = $config->reflect()->api->secret;

		$cryptor = new Encryption($token, $secret);
		return $cryptor->decrypt() ?: [];
	}
}

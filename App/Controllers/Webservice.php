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

namespace App\Controllers;

use App\Helpers\inc\WS;
use FloatPHP\Kernel\ApiController;
use FloatPHP\Helpers\Framework\Security;

final class Webservice extends ApiController
{
	/**
	 * WebserviceIndex : [GET] /api/v[i:version]/
	 *
	 * @access public
	 * @param string $version
	 * @return void
	 */
	public function index(string $version)
	{
		WS::i($version, 'main')::index();
	}

	/**
	 * Is HTTP authenticated (Overrided).
	 *
	 * @access public
	 * @return bool
	 */
	public function isHttpAuthenticated() : bool
	{
		// Init security
		(new Security())
			->useTokenOnly()
			->useAccessProtection();

		// Admin access
		if ( parent::isHttpAuthenticated() ) {
			return true;
		}

		// Unauthorized
		$this->setHttpResponse('Unauthorized', [
			'details' => 'Authorization Required'
		], 'error', 401);

		return false;
	}
}

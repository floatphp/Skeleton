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

namespace App\Controllers;

use App\Helpers\inc\Repo;
use FloatPHP\Kernel\AbstractAuth;
use FloatPHP\Helpers\Framework\Security;

final class AuthController extends AbstractAuth
{
	/**
	 * @inheritdoc
	 */
	public function __construct()
	{
		// Security
		(new Security())->useLimitedAttempt();
	}

	/**
	 * authIndex [GET] /admin/login/h/
	 *
	 * @inheritdoc
	 */
	public function index() : void
	{
		$this->render('admin/login/index');
	}

	/**
	 * authLogin [POST] /admin/login/h/
	 *
	 * @inheritdoc
	 */
	public function login() : void
	{
		$this->authenticate(
			Repo::i('auth')
		);
	}
}

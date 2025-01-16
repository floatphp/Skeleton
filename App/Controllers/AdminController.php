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

use App\Helpers\inc\IO;
use FloatPHP\Kernel\BackendController;

final class AdminController extends BackendController
{
	/**
	 * @inheritdoc
	 */
	public function __construct()
	{
		parent::__construct([
			'menu' => IO::i('menu')::get()
		]);
	}

	/**
	 * adminIndex : [GET] /admin/dashboard/i/
	 *
	 * @inheritdoc
	 */
	public function index() : void
	{
		$this->render('admin/dashboard/index');
	}

	/**
	 * adminUpdate : [POST] /admin/dashboard/i/
	 *
	 * @inheritdoc
	 */
	public function update() : void
	{
		// ...
	}

	/**
	 * configIndex : [GET] /admin/[:name]/c/
	 *
	 * @inheritdoc
	 */
	public function configIndex(string $name) : void
	{
		$inputs = IO::i('input')->set($name)->get();

		$this->render('admin/config/index', ['inputs' => $inputs]);
	}

	/**
	 * configUpdate : [POST] /admin/[:name]/c/
	 *
	 * @inheritdoc
	 */
	public function configUpdate(string $name) : void
	{
		$payload = $this->sanitizeRequest(verify: true, force: true);

		if ( IO::i('config')->update($name, $payload) ) {
			$this->setResponse('Item updated');
		}

		$this->setResponse('Unable to update', [], 'warning');
	}

	/**
	 * cache : [DELETE] /admin/cache/
	 *
	 * @inheritdoc
	 */
	public function cache() : void
	{
		$this->verifyRequest();

		if ( IO::i(name: 'config')->purge() ) {
			$this->setResponse('Item deleted');
		}

		$this->setResponse('Unable to delete', [], 'warning');
	}
}

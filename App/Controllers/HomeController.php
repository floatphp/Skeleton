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
use FloatPHP\Kernel\FrontController;

final class HomeController extends FrontController
{
	/**
	 * homeIndex : [GET] /
	 *
	 * @inheritdoc
	 */
	public function index() : void
	{
		$io = IO::i('config');
		$data = $io->get('home', true);

		$this->render('/front/home/index', [
			'data' => $data
		]);
	}
}

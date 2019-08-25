<?php
/**
 * @author    : JIHAD SINNAOUR
 * @package   : FloatPHP
 * @subpackage: App Component
 * @version   : 1.0.0
 * @category  : PHP framework
 * @copyright : (c) JIHAD SINNAOUR <mail@jihadsinnaour.com>
 * @link      : https://www.floatphp.com
 * @license   : MIT License
 */

namespace App\Controllers;

use floatPHP\Kernel\BackendController;

class DashboardController extends BackendController
{
	/**
	 * route : homeIndex
	 * GET /
	 *
	 * @param void
	 * @return void
	 */
	public function index()
	{
		$this->render([
			'example' => '{Example from controller}'
		], 'dashboard' );
	}
}

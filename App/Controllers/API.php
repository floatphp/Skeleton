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

use floatPHP\Kernel\ApiController;

class API extends ApiController
{
	/**
	 * apiIndex : GET /api/v1/
	 *
	 * @param void
	 * @return json
	 */
	public function index()
	{
		$this->info();
	}
}

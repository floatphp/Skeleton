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

namespace App\Models;

use floatPHP\Kernel\Model;

class Config extends Model
{
	/**
	 * @access protected
	 */
	protected $table = 'config';
	protected $key	 = 'configID';

	/**
	 * @param null|string $param
	 * @return []
	 */
	public function get($param = null)
	{
		if (is_null($param)) 
		{
			$exec = $this->db->query('SELECT * FROM config');
			return array_shift($exec);
		}
		else
		{
			return $this->db->single("SELECT $param FROM config");
		}
	}
}

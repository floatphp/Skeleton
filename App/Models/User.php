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

class User extends Model
{
	/**
	 * @access protected
	 */
	protected $table = 'user';
	protected $key	 = 'userID';
	
	/**
	 * @param void
	 * @return object
	 */
	public static function build()
	{
		return new self();
	}

	/**
	* @param int|string $id
	* @return []
	*/
	public function get($id)
	{
		$this->find($id);
		return $this->data;
	}

	/**
	* @param int|string $id
	* @return []
	*/
	public function getRole($id)
	{
		// get data
		$bind = ['id'=>$id];
		$sql = "SELECT p.role
		FROM user u, permission p
		WHERE u.permissionID = p.permissionID
		AND u.userID = :id";

		$exec = $this->db->query($sql,$bind);
		return array_shift($exec);
	}

	/**
	* @param int|string $id
	* @return []
	*/
	public function getName($id)
	{
		// get data
		$bind = ['id'=>$id];
		$sql = "SELECT u.name
		FROM user u
		WHERE u.userID = :id";

		$exec = $this->db->single($sql,$bind);
		return $exec;
	}

	/**
	* @param string $username
	* @return []
	*/
	public function getAuthentication($auth)
	{
		// get data
		$bind = ['username' => $auth,'email' => $auth];
		$sql = "SELECT *
		FROM user u
		WHERE u.username = :username
		OR u.email = :email";

		$exec = $this->db->query($sql,$bind);
		return array_shift($exec);
	}

	/**
	* @param string $username
	* @return []
	*/
	public function getByUsername($username)
	{
		return $this->where('username',$username);
	}

	/**
	* @param string $username
	* @return []
	*/
	public function getByEmail($email)
	{
		return $this->where('email',$email);
	}

	/**
	* @param string $username
	* @return []
	*/
	public function getByuserID($id)
	{
		// get data
		$bind = ['id' => $id];

		$sql = "SELECT u.name,p.role
		FROM user u, permission p
		WHERE u.permissionID = p.permissionID
		AND u.userID = :id";

		$exec = $this->db->query($sql, $bind);
		return $exec;
	}

	/**
	* @param void
	* @return array|object
	*/
	public function getActive()
	{
		// get data
		$bind = ['situation' => 1];

		$sql = "SELECT u.userID,u.username,u.name,u.email,p.label
		FROM user u, permission p
		WHERE u.permissionID = p.permissionID
		AND u.situation = :situation";

		$exec = $this->db->query($sql, $bind);
		return $exec;
	}

	/**
	* @param void
	* @return array|object
	*/
	public function getArchive()
	{
		return $this->where('situation',0);
	}

	/**
	* @param void
	* @return int
	*/
	public function countActive()
	{
		return $this->count('situation',1);
	}

	/**
	* @param void
	* @return int
	*/
	public function countArchive()
	{
		return $this->count('situation',0);
	}

}
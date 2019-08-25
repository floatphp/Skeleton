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
use floatPHP\Classes\Auth\Session;
use App\Models\User;
use App\Models\Config;

class AuthController extends BackendController
{
	protected $user;
	protected $config;
	protected $session;

	public function __construct()
	{
		$this->config  = new Config();
		$this->session = new Session();
	}

	/**
	 * route : authIndex
	 * GET /login/
	 *
	 * @param void
	 * @return void
	 */
	public function index()
	{
		$this->content = [
			'root' => $this->config->get('root'),
			'name' => $this->config->get('name')
		];
		$this->render( $this->content ,'system/login');
	}

	/**
	 * route : authLogin
	 * POST /login/
	 *
	 * @param void
	 * @return void
	 */
	public function login()
	{
		$username = $_POST['username'];
		$password = $_POST['password'];

		$user = new User();
		$u = $user->getAuthentication($username);

		if ( password_verify($password,$u['password']) )
		{
			$this->session->register();
			if ($this->session->isRegistered() && !$this->session->isExpired())
			{
				$this->session->set('userID',$u['userID']);
				echo 'success';
			}
		}
		else
		{
			$this->session->end();
			echo 'error';
		}
	}
	
	/**
	 * route : authLogin
	 * POST /logout/
	 *
	 * inherit : userLogin
	 *
	 * @param void
	 * @return void
	 */
	public function logout()
	{
		$this->session->end();
	}
}

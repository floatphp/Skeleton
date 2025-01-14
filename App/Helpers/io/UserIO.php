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

use App\Helpers\inc\Repo;
use FloatPHP\Classes\Http\Session;
use FloatPHP\Helpers\Filesystem\Cache;

final class UserIO
{
	public const NAME = 'user';

	/**
	 * Get user.
	 *
	 * @inheritdoc
	 */
	public static function get() : array
	{
		$cache = (new Cache())
			->persist()
			->validate()
			->setGroup(self::NAME);

		$id = (int)Session::get('userId');
		$key = $cache->getKey(self::NAME, ['id' => $id]);

		$data = $cache->get($key, $status);
		if ( !$status ) {
			$data = Repo::i(self::NAME)->getById($id);
			$cache->set($key, $data);
		}

		return $data ?: [];
	}

	/**
	 * Get user name by Id.
	 *
	 * @inheritdoc
	 */
	public static function getName(int $id) : string
	{
		$cache = (new Cache())
			->persist()
			->setGroup(self::NAME);

		$key = $cache->getKey(self::NAME, ['name' => $id]);

		$data = $cache->get($key, $status);
		if ( !$status ) {
			$data = Repo::i(self::NAME)->getName($id);
			$cache->set($key, $data);
		}

		return $data ?: [];
	}
}

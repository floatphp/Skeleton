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

namespace App\Helpers\io;

use FloatPHP\Helpers\Connection\Settings;
use FloatPHP\Helpers\Http\Submitter;
use FloatPHP\Helpers\Filesystem\Cache;
use FloatPHP\Classes\Filesystem\Stringify;

/**
 * Config helper.
 */
final class ConfigIO
{
	/**
	 * @inheritdoc
	 */
	public const NAME = 'config';

	/**
	 * Get config by name.
	 *
	 * @inheritdoc
	 */
	public function get(string $name) : array
	{
		$cache = (new Cache())
			->persist()
			->setGroup(self::NAME);

		$key = $cache->getKey(self::NAME, [
			'config' => $name
		]);

		$data = $cache->get($key, $status);

		if ( !$status ) {
			$data = (new Settings($name))->get();
			$cache->set($key, $data);
		}

		return $data ?: [];
	}

	/**
	 * Update config.
	 *
	 * @inheritdoc
	 */
	public function update(string $name, array $input) : bool
	{
		self::purge();
		$input = (new Submitter())->format($input);
		return (new Settings($name))->set($input);
	}

	/**
	 * Purge cache.
	 *
	 * @inheritdoc
	 */
	public static function purge(bool $force = false, ?string $group = null) : bool
	{
		$cache = new Cache();
		return $force
			? $cache->clear()
			: $cache->purge($group);
	}
}

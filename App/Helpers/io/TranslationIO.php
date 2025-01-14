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

use FloatPHP\Helpers\Filesystem\Cache;
use FloatPHP\Kernel\Base;

final class TranslationIO extends Base
{
	public const NAME = 'translation';

	/**
	 * Get translations.
	 *
	 * @inheritdoc
	 */
	public function get(string $type = 'admin') : array
	{
		$cache = (new Cache())
			->persist()
			->setGroup(self::NAME);

		$id = 0;
		if ( $type == 'admin' ) {
			$id = UserIO::get()['userId'] ?? 0;
		}
		$key = $cache->getKey(self::NAME, ['type' => $type, 'id' => $id]);

		$data = $cache->get($key, $status);
		if ( !$status ) {
			$data = $this->loadStrings($type);
			$cache->set($key, $data);
		}

		return $data ?: [];
	}
}

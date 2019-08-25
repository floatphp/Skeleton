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

use floatPHP\Kernel\FrontController;

class CacheController extends FrontController
{
	/**
	 * @access protected
	 */
	protected $path;
	protected $handler;

	/**
	 * @param void
	 * @return void
	 */
	public function __construct()
	{
		// set cache directory
		$this->path = dirname(dirname(__FILE__)) . '/Storage/cache';
	}

	/**
	 * cacheClean : GET /cache/clean/
	 *
	 * @param void
	 * @return void
	 */
	public function clean()
	{
		if(is_dir($this->path))
		{
			$this->handler = opendir($this->path);
		}
		if(!$this->handler)
		{
			return false;
		}
	   	while( $file = readdir($this->handler) )
	   	{
	      if ($file != "." && $file != "..")
	      {
	         if (!is_dir($this->path."/".$file))
	            @unlink($this->path."/".$file);
	         else
	            $this->removeDir($this->path.'/'.$file);
	      }
	   }
	   closedir($this->handler);
	   return true;
	}
	
	/**
	 * @param ressource $dir
	 * @return void
	 */
	private function removeDir($dir)
	{
	    foreach(scandir($dir) as $file)
	    {
	        if ('.' === $file || '..' === $file) continue;
	        if (is_dir("$dir/$file")) rmdir_recursive("$dir/$file");
	        else unlink("$dir/$file");
	    }
	    rmdir($dir);
	}
}

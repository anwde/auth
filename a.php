<?php 
class Dev{
	protected $group = 'dev';
	protected $name = 'dev';
	protected $description = 'dev';
	static $source = 'system';
	static $dir = __DIR__;
	static $base_dir = '';
	//whites   只放包括
	//blacklist  包括的不放
	static $project = [
		'331' => ['name' => '测试-有盐编辑后台', 
            'dir' => 'codeigniter-tools', 
            'whites' => ['redux' => ['store', 'server', '1--reducers.js'], 
            'components' => ['base', 'captcha', 'loading']], 
            'blacklist' => ['utils' => ['customizer'], 'routes' => ['router'], 'layouts' => ['components']]
            ],
	];
	static public function run() {
		self::$base_dir = self::$dir . '/';
		self::sync_dir('module');

	}

	static public function sync_dir($d) {
		$source_dir = self::$base_dir . 'authorize/' . self::$source . '/' . $d . '/'; 
		foreach (self::$project as $key => $value) {
			$destination_dir = str_replace(self::$source, $value['dir'], $source_dir); 
			self::copy_dir($source_dir, $destination_dir, $d, $value);
		}
	}

	/**
	 * 复制文件夹
	 * @param $source
	 * @param $dest
	 */
	static public function copy_dir($source, $dest, $d, $project) {
		if (!file_exists($dest)) {
			mkdir($dest, 0755, true);
		}
		$handle = opendir($source);
		while (($item = readdir($handle)) !== false) {
			$f = 1;
			if ($item == '.' || $item == '..') {
				continue;
			}
			$_source = str_replace('//', '/', $source . '/' . $item);
			$_dest = str_replace('//', '/', $dest . '/' . $item);
			if (isset($project['blacklist'][$d])) {
				$blacklist = 0;
				foreach ($project['blacklist'][$d] as $key => $value) {
					$p = $d . '/' . $value;
					$strpos = strpos($_source, $p);
					if ($strpos) {
						$blacklist = 1;
						break;
					}
				}
				if ($blacklist) {
					continue;
				}
			}
			if (isset($project['whites'][$d])) {
				$f = 0;
				foreach ($project['whites'][$d] as $key => $value) {
					$p = $d . '/' . $value;
					$strpos = strpos($_source, $p);
					if ($strpos) {
						$f = 1;
						break;
					}
				}
			}

			if ($f && is_file($_source)) {
				self::copy_file($_source, $_dest);
			}
			if ($f && is_dir($_source)) {
				self::copy_dir($_source, $_dest, $d, $project);
			}
		}
		closedir($handle);
	}
	/**
	 * 复制文件
	 * @param $source
	 * @param $dest
	 */
	static public function copy_file($source, $dest) {
		if (!file_exists($source)) {
			return 0;
		}
		if (!file_exists($dest)) {
			if (!is_dir(dirname($dest))) {
				@mkdir(dirname($dest), 0755, true);
			}
		}
		// CLI::write($source);
		// CLI::write($dest);
		copy($source, $dest);
	}
}
Dev::run();
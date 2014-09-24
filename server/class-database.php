<?php
class Database {
	public static $instance;

	private function __construct() {}
	public static function getDB() {
		if(!self::$instance) {
			self::$instance = new mysqli('localhost', 'root', 'root', 'jobwall_barcamp');

			if(mysqli_connect_error()) {
				die('error');
			} else {
				return self::$instance;
			}
		} else {
			return self::$instance;
		}
	}
}
?>
<?php
Class User {
	public function __construct() {
	}
	public static function logout() {
		session_destroy();
	}
	public static function isLoggedIn() {
		if(isset($_SESSION['user'])) {
			if(isset($_SESSION['user']['userID'])) {
				return true;
			}
		}
		
		return false;
	}
	
	public static function getUserID($network, $key) {
		$db = Database::getDB();
		
		$sql = 'SELECT id, owner, name, image FROM users WHERE auth_key = ? LIMIT 1';
		if($stm = $db->prepare($sql)) {
			$key = $network . '_' . $key;
			
			$stm->bind_param('s', $key);
			if($stm->execute()) {
				$stm->bind_result($id, $owner, $name, $image);
				
				while($stm->fetch()) {
					return array('userID' => $id, 'owner' => $owner, 'name' => $name, 'image' => $image);
				}
			}
		}
	}
	public static function createUser($network, $key, $name, $image, $email) {
		$db = Database::getDB();
		
		$sql = 'INSERT INTO users (auth_key, name, email, image) VALUES(?, ?, ?, ?)';
		if($stm = $db->prepare($sql)) {
			$tempKey = $network . '_' . $key;
			$stm->bind_param('ssss', $tempKey, $name, $email, $image);
			
			if($stm->execute()) {
				return self::getUserID($network, $key);
			}
		}
	}
	public static function checkUser($network, $key) {
		$db = Database::getDB();
		
		$sql = 'SELECT COUNT(id) FROM users WHERE auth_key = ? LIMIT 1';
		if($stm = $db->prepare($sql)) {
			$key = $network . '_' . $key;
			$stm->bind_param('s', $key);
			
			if($stm->execute()) {
				$stm->bind_result($count);
				
				while($stm->fetch()) {
					if($count > 0) return true;
				}
			}
		}
		
		return false;
	}
}
?>
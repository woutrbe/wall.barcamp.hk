<?php
date_default_timezone_set('Asia/Krasnoyarsk');

class Jobs {
	public static $total = 0;
	public static $limit = 25;
	
	public static function getjobcount() {
		$db = Database::getDB();
		
		$sql = "SELECT COUNT(id) AS count FROM jobs WHERE hide = 'false'";
		if($result = $db->query($sql)) {
			while($row = $result->fetch_object()) {
				return $row->count;
			}
		}
		
		return 0;
	}
	
	public static function getCats() {
		$db = Database::getDB();
		
		$cats = array();
		
		$sql = "SELECT id, link, color, length, admin FROM cats ORDER BY sort ASC";
		
		if($result = $db->query($sql)) {
			while($row = $result->fetch_object()) {
				$row->safeLink = str_replace(' ', '-', strtolower($row->link));
				array_push($cats, $row);
			}
		}
		
		return $cats;
	}
	public static function getCatLength($catID) {
		$db = Database::getDB();
		
		$sql = 'SELECT length FROM cats WHERE id = ? LIMIT 1';
		if($stm = $db->prepare($sql)) {
			$stm->bind_param('i', $catID);
			if($stm->execute()) {
				$stm->bind_result($length);
				
				while($stm->fetch()) {
					return $length;
				}
			}
		}
	}
	
	/**
	 * Get all the jobs
	 *
	 * @param $from The position to start from in the dabase
	 * @param $catID The category
	 */
	public static function getJobs($from, $catID = 0, $postedAfter = 0) {
		$db = Database::getDB();
		$jobs = array();
		
		$sql = "SELECT SQL_CALC_FOUND_ROWS jobs.id, jobs.userID, jobs.content, jobs.timestamp, jobs.link, jobs.catID, cats.id, cats.link, cats.color, cats.length, cats.admin ";
		$sql .= "FROM jobs ";
		$sql .= "INNER JOIN cats ON jobs.catID = cats.id ";
		
		if($catID != 0) {
			$sql .= "WHERE jobs.catID = " . $catID . " AND hide = 'false' ";
		} else {
			$sql .= "WHERE hide = 'false' ";
		}
		
		if($postedAfter != 0) {
			$sql .= "AND jobs.timestamp >= " . $postedAfter . " ";
		}
		
		$sql .= "ORDER BY jobs.id DESC LIMIT ?, ?";
		
		if($stm = $db->prepare($sql)) {			
			$from = self::$limit * $from;
			
			$stm->bind_param('ii', $from, self::$limit);
			if($stm->execute()) {
				$stm->bind_result($jobID, $userID, $content, $timestamp, $jobLink, $catID, $catsID, $catsLink, $catsColor, $catsLength, $catsAdmin);
				
				$content = $content;
				
				while($stm->fetch()) {
					$stm->store_result();

					$content = html_entity_decode(self::formatContent(str_replace('&amp;nbsp;', ' ', stripslashes($content))));
					$content = iconv('UTF-8', 'UTF-8//IGNORE', utf8_encode($content));
					
					$job = array(
							'jobID' => $jobID, 
							'content' => $content, 
							'timestamp' => $timestamp * 1000, 
							'jobLink' => $jobLink, 
							'catID' => $catID,
							'isMine' => (isset($_SESSION['wall_login']) ? $_SESSION['wall_login']['userID'] == $userID: false),
							'cat' => array(
								'id' => $catsID,
								'link' => $catsLink,
								'color' => $catsColor,
								'length' => $catsLength,
								'admin' => $catsAdmin,
								'safeLink' => str_replace(' ', '-', strtolower($catsLink))
							)
						);
					// $job = self::createJobView($job);

					array_push($jobs, $job);
				}
			}
		}
		
		// total rows
		self::$total = $db->query("SELECT FOUND_ROWS()")->fetch_object();
		
		foreach(self::$total as $data) {
			self::$total = $data;
			break;
		}

		return $jobs;
	}
	
	/**
	 * Check if the jobs is yours
	 */
	public static function checkOwnerShip($jobID) {
		$db = Database::getDB();
		
		$sql = 'SELECT jobs.userID FROM jobs WHERE id = ? LIMIT 1';
		if($stm = $db->prepare($sql)) {
			$stm->bind_param('i', $jobID);
			if($stm->execute()) {
				$stm->bind_result($userID);
				while($stm->fetch()) {
					if(isset($_SESSION['wall_login']) && isset($_SESSION['wall_login']['owner'])) {
						if($_SESSION['wall_login']['owner'] == 1 || $_SESSION['wall_login']['userID'] == $userID) return true;
					}
				}
			}
		}
	
		return false;
	}
	/**
	 * Check if a job exists
	 */
	public static function checkJob($jobLink) {
		$db = Database::getDB();
		
		$sql = 'SELECT jobs.id, jobs.content, jobs.timestamp, jobs.link, jobs.catID, cats.color, cats.link ';
		$sql .= ' FROM jobs INNER JOIN cats ON jobs.catID = cats.id WHERE jobs.link = ? LIMIT 1';
		
		if($stm = $db->prepare($sql)) {
			$stm->bind_param('s', $jobLink);
			if($stm->execute()) {
				$stm->bind_result($jobID, $content, $timestamp, $jobLink, $catID, $color, $link);
				
				while($stm->fetch()) {
					return array('jobID' => $jobID, 'content' => $content, 'timestamp' => $timestamp, 'jobLink' => $jobLink, 'catID' => $catID, 
						'cat' => array(
							'color' => $color, "link" => $link
						));
				}
			}
		}
		
		return null;
	}
	
	/**
	 * Remove a job
	 *
	 * @param $jobID ID of the job to be removed
	 */
	public static function removeJobs($jobID) {
		$db = Database::getDB();
		
		$sql = 'DELETE FROM jobs WHERE id = ?';
		if($stm = $db->prepare($sql)) {
			$stm->bind_param('i', $jobID);
			if($stm->execute()) {
				return true;
			}
		}
	}

	/**
	 * Create a new job
	 */
	public static function createJob($content, $catID) {
		$db = Database::getDB();
		
		$sql = 'INSERT INTO jobs (userID, catID, content, timestamp, link) VALUES(?, ?, ?, ?, ?)';
		if($stm = $db->prepare($sql)) {
			$userID = $_SESSION['wall_login']['userID'];
			$link = uniqid();
			
			// cut content
			if(false == false) {
				$length = 9999;
			} else {
				$length = self::getCatLength($catID);
			}
			
			$content = substr($content, 0, $length);
			
			$timestamp = time();
			
			// Remove [img] tags if we're not the owner
			if($_SESSION['wall_login']['owner'] != 1) {
				$content = preg_replace('#\[img\](.*?)\[/img\]#is', '', $content);
			} 
			
			$content = htmlentities(strip_tags(str_replace(' ', '&nbsp;', nl2br($content))));
			
			// do not remove whitespaces
			$stm->bind_param('iisis', $userID, $catID, $content, $timestamp, $link);
						
			if($stm->execute()) {
				$content = '<p>' . html_entity_decode(self::formatContent(str_replace('&amp;nbsp;', ' ', stripslashes($content)))) . '</p>';
				
				$json = array('jobID' => $stm->insert_id, 'link' => $link, 'content' => $content);
				return json_encode($json);
			}
		}
		
		return false;
	}
	
	/**
	 * Flag a post
	 */
	public static function flagJob($jobID) {
		if(self::checkIfFlagged($jobID)) return false;
		
		$db = Database::getDB();
		
		$sql = 'INSERT INTO flags (jobID, userID) VALUES(?, ?)';
		if($stm = $db->prepare($sql)) {
			$stm->bind_param('ii', $jobID, $_SESSION['wall_login']['userID']);
			if($stm->execute()) {
				return true;
			}
		}
		
		return false;
	}
	/**
	 * Check how many flags a post has
	 */
	public static function checkJobForFlags($jobID) {
		$db = Database::getDB();
		
		$sql = $sql = 'SELECT COUNT(id) FROM flags WHERE jobID = ? AND userID = ? LIMIT 1';
		if($stm = $db->prepare($sql)) {
			$stm->bind_param('ii', $jobID, $_SESSION['wall_login']['userID']);
			if($stm->execute()) {
				$stm->bind_result($count);
				
				while($stm->fetch()) {
					return $count;
				}
			}
		}
		
		return 0;
	}
	
	/**
	 * Get the link for a job
	 */
	public static function getLink($jobID) {
		$db = Database::getDB();
		
		$sql = 'SELECT link FROM jobs WHERE id = ? LIMIT 1';
		if($stm = $db->prepare($sql)) {
			$stm->bind_param('i', $jobID);
			if($stm->execute()) {
				$stm->bind_result($link);
				
				while($stm->fetch()) {
					return $link;
				}
			}
		}
	}
	
	
	/**
	 * Show a job again
	 */
	public static function showJobAgain($link) {
		$db = Database::getDB();
		
		$sql = 'SELECT jobID FROM flagged_jobs WHERE link = ? LIMIT 1';
		if($stm = $db->prepare($sql)) {
			$stm->bind_param('s', $link);
			if($stm->execute()) {
				$stm->bind_result($jobID);
				
				$tempJobID = null;
				
				while($stm->fetch()) {
					$tempJobID = $jobID;
				}
				
				// change hide back to 'false'
				$sql = 'UPDATE jobs SET hide = "false" WHERE id = ?';
				if($stm = $db->prepare($sql)) {
					$stm->bind_param('i', $tempJobID);
					$stm->execute();
				}
				
				// remove all flags
				$sql = 'DELETE FROM flags WHERE jobID = ?';
				if($stm = $db->prepare($sql)) {
					$stm->bind_param('i', $tempJobID);
					$stm->execute();
				}
				
				// remove the link in flagged_posts
				$sql = 'DELETE FROM flagged_jobs WHERE jobID = ?';
				if($stm = $db->prepare($sql)) {
					$stm->bind_param('i', $tempJobID);
					$stm->execute();
				}
			}
		}
	}
	
	/**
	 * Hide a job
	 */
	public static function hideJob($jobID) {
		$db = Database::getDB();
		
		$sql = 'UPDATE jobs SET hide = "true" WHERE id = ?';
		if($stm = $db->prepare($sql)) {
			$stm->bind_param('i', $jobID);
			$stm->execute();
			
			if($_SESSION['wall_login']['owner'] != 5) {
				$link = uniqid();
				
				$sql = 'INSERT INTO flagged_jobs (jobID, link) VALUES(?, ?)';
				if($stm = $db->prepare($sql)) {
					$stm->bind_param('is', $jobID, $link);
					if($stm->execute()) {
						// send out link here
						$cancelLink = 'http://wall.barcamp.hk/cancel/' . $link;
						$to = 'wall@barcamp.hk';
						$subject = 'A post has been flagged as inapropriate';
						
						$body = 'Hi there, <br /><br />';
						$body .= '5 people have flagged this post as inapropriate, <a href="http://wall.barcamp.hk/jobs/' . self::getLink($jobID) . '" title="Have a look">have a look yourself</a>. <br />';
						$body .= 'If you disagree, <a href="' . $cancelLink . '" title="Show this post again">show this post again</a>. <br /><br />';
						$body .= 'Thanks';
						
						$headers = "From: wall@barcamp.hk\r\n";
						$headers .= "Reply-To: wall@barcamp.hk\r\n";
						$headers .= "MIME-Version: 1.0\r\n";
						$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
						
						mail($to, $subject, $body, $headers);
					}
				}
			}
		}
	}
	
	/**
	 * Check if a job is flagged or not by the user
	 */
	public static function checkIfFlagged($jobID) {
		$db = Database::getDB();
		
		$sql = 'SELECT COUNT(id) FROM flags WHERE jobID = ? AND userID = ? LIMIT 1';
		
		if($stm = $db->prepare($sql)) {
			$stm->bind_param('ii', $jobID, $_SESSION['wall_login']['userID']);
			if($stm->execute()) {
				$stm->bind_result($count);
				
				while($stm->fetch()) {
					if($count > 0) return true;
				}
			}
		}
		
		return false;
	}
	/**
	 * Format content
	 */
	public static function formatContent($content) {
		$content = preg_replace('#\*([^\s\*]([^\*]*[^\s\*])?)\*#is', '<strong>$1</strong>', $content);
		$content = preg_replace('#\+([^\s\*]([^\*]*[^\s\*])?)\+#is', '<i>$1</i>', $content);
		$content = preg_replace('#\_([^\s\*]([^\*]*[^\s\*])?)\_#is', '<u>$1</u>', $content);
		
		$content = preg_replace('!(((f|ht)tp://)[-a-zA-Zа-яА-Я()0-9@:%_+.~#?&;//=]+)!i', '<a href="$1" target="_blank">$1</a>', $content);
		// $content = eregi_replace('([[:space:]()[{}])(www.[-a-zA-Z0-9@:%_\+.~#?&//=]+)', '\\1<a href="\\2" target="_blank">\\2</a>', $content);
	
		//$content = preg_replace('@(https?://([-\w\.]+[-\w])+(:\d+)?(/([\w/_\.#-]*(\?\S+)?[^\.\s])?)?)@', '<a href="$1" target="_blank">$1</a>', $content);
		
		$content = self::emailize($content);
		  
		//$content = preg_replace('{\b(?:(?:https?|ftp)://)\S+[.]\S+\b}i', '<a href="$0">$0</a>', $content);
		//$content = preg_replace('{\b(?<!["\'=><.])[-a-zA-Zа-яА-Яа-яА-Я()0-9@:%_+.~#?&;//=]+[.][-a-zA-Zа-яА-Яа-яА-Я()0-9@:%_+.~#?&;//=]+(?!["\'=><.])\b}i', '<a href="http://$0">http://$0</a>', $content);
		                  
		
		//$content = preg_replace('(((f|ht){1}tp://)[-a-zA-Z0-9@:%_\+.~#?&//=]+)', '<a href="\\1">\\1</a>', $content); 
		//$content = preg_replace('([[:space:]()[{}])(www.[-a-zA-Z0-9@:%_\+.~#?&//=]+)', '\\1<a href="http://\\2">\\2</a>', $content); 
		//$content = preg_replace('([_\.0-9a-z-]+@([0-9a-z][0-9a-z-]+\.)+[a-z]{2,3})', '<a href="mailto:\\1">\\1</a>', $content); 
				
		return $content;
	}
	static function emailize($text) {
		$regex = '/(\S+@\S+\.\S+)/is';
		$replace = "<a href='mailto:$1'>$1</a>";
		
		$result = preg_replace($regex, $replace, $text);
		
		return $result;
	}	
}
?>
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
	
	public static function getCats($admin = 0) {
		$db = Database::getDB();
		
		$cats = array();
		
		$sql = "SELECT id, link, color, length FROM cats ";
		
		$sql .= ($admin == 1 ? "WHERE admin = 0 OR admin = 1 " : "WHERE admin = 0 ");
		//if($admin == 1) $sql .= "WHERE admin = 1 ";
		
		$sql .= "ORDER BY sort ASC";
		
		if($result = $db->query($sql)) {
			while($row = $result->fetch_object()) {
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
		
		$sql = "SELECT SQL_CALC_FOUND_ROWS jobs.id, jobs.content, jobs.timestamp, jobs.link, jobs.catID, cats.color, cats.link ";
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
				$stm->bind_result($jobID, $content, $timestamp, $jobLink, $catID, $color, $link);
				
				$content = $content;
				
				while($stm->fetch()) {
					$stm->store_result();
					
					$job = array('jobID' => $jobID, 'content' => $content, 'timestamp' => $timestamp, 'jobLink' => $jobLink, 'catID' => $catID, 'color' => $color, "link" => $link);
					$job = self::createJobView($job);
					
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
					if(isset($_SESSION['user']) && isset($_SESSION['user']['owner'])) {
						if($_SESSION['user']['owner'] == 1 || $_SESSION['user']['userID'] == $userID) return true;
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
					return array('jobID' => $jobID, 'content' => $content, 'timestamp' => $timestamp, 'jobLink' => $jobLink, 'catID' => $catID, 'color' => $color, "link" => $link);
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
			$userID = $_SESSION['user']['userID'];
			$link = uniqid();
			
			// cut content
			if($_SESSION['user']['owner'] == 1) {
				$length = 9999;
			} else {
				$length = self::getCatLength($catID);
			}
			
			$content = substr($content, 0, $length);
			
			$timestamp = time();
			
			/* if($_SESSION['user']['owner'] != 1) {
				$content = preg_replace('#\[img\](.*?)\[/img\]#is', '', $content);
			} */
			
			$content = htmlentities(strip_tags(str_replace(' ', '&nbsp;', nl2br($content))));
			
			// shorten url
			//$content = preg_replace('!(((f|ht)tp://)[-a-zA-Zа-яА-Я()0-9@:%_+.~#?&;//=]+)!ie', 'self::shortenUrl("$1")', $content);
			//$content = eregi_replace('([[:space:]()[{}])(www.[-a-zA-Z0-9@:%_\+.~#?&//=]+)/e', '\\1 self::shortenUrl("\\2")', $content);
			
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
			$stm->bind_param('ii', $jobID, $_SESSION['user']['userID']);
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
			$stm->bind_param('ii', $jobID, $_SESSION['user']['userID']);
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
			
			if($_SESSION['user']['owner'] != 5) {
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
			$stm->bind_param('ii', $jobID, $_SESSION['user']['userID']);
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
	 * Create a new job view
	 *
	 * @param $job Job array
	 */
	public static function createJobView($job, $editable = false, $single = false) {
		if($job == null) {
			$job = array('link' => '', 'color' => '244, 225, 61');
		}
		
		$class = strtolower(str_replace(" ", "-", $job['link']));
		
		$jobClass = '';
		$mailLink = '';
		$tweetLink = '';
		
		if(isset($job['jobID'])) {
			$jobClass = 'data-job=' . $job['jobID'];
			
			$mailContent = stripslashes(str_replace('<br />', ' ', nl2br(html_entity_decode(preg_replace('#\*([^\s\*]([^\*]*[^\s\*])?)\*#is', '$1', str_replace('&amp;nbsp;', ' ', preg_replace('#\[img\](.*?)\[/img\]#is', '', trim($job['content']))))))));
			
			$mailLink = 'mailto:?body=http://wall.barcamp.hk/jobs/' . $job['jobLink'];
			$tweetLink = 'http://twitter.com/home?status=' . substr($mailContent, 0, 110) . '... - http://wall.barcamp.hk/jobs/' . $job['jobLink'];
		}
		
		$removeAble = '';
		if(isset($job['jobID']) && self::checkOwnerShip($job['jobID']) && isset($_SESSION['nextAction']) && $_SESSION['nextAction'] == 'removeJob' && $_SESSION['jobID'] == $job['jobID']) {
			$removeAble = 'removeAble';
		}
		
		$editableClass = '';
		if($editable) $editableClass = 'editable';
		
		$timestamp = time();
		if(isset($job['timestamp'])) $timestamp = $job['timestamp'];
		
		$maxLength = '';
		if($editable) {
			if($_SESSION['user']['owner'] == 1) {
				$maxLength = 'data-max="9999"';
			} else {
				$maxLength = 'data-max="' . $job['max'] . '"';
			}
		}
		
		$div = '<div class="job ' . $class . ' ' . $removeAble . ' ' . $editableClass . '" ' . $jobClass . ' ' . $maxLength . '>';
		
			// replace background images
			$backgroundSize = '';
			if(preg_match('#\[img\](.*?)\[/img\]#is', $job['content'], $matches)) {		
				if($single == true) $backgroundSize = '; background-size: 100%';
						
				$background = 'background: rgb(' . $job['color'] . ') url(' . $matches[1] . ') no-repeat right bottom';
				
				$job['content'] = preg_replace('#\[img\](.*?)\[/img\]#is', '', $job['content']);
			} else {
				$background = 'background-color: rgb(' . $job['color'] . ')';
			}
			
			$div .= '<div class="border">';
				$div .= '<div class="inner" style="' . $background . $backgroundSize . '">';
					if($editable) {
						$cats = self::getCats($_SESSION['user']['owner']);
						
						$div .= '<select name="cat">';
							foreach($cats as $cat) {
								if($job['color'] == $cat->color) {
									$div .= '<option value="' . $cat->id . '" data-color="' . $cat->color . '" selected="selected">' . $cat->link . '</option>';
								} else {
									$div .= '<option value="' . $cat->id . '" data-color="' . $cat->color . '">' . $cat->link . '</option>';
								}
							}
						$div .= '</select>';
					}
					
					$div .= '<div class="content">';
						$div .= '<p>' . html_entity_decode(self::formatContent(str_replace('&amp;nbsp;', ' ', stripslashes($job['content'])))) . '</p>'; 
					$div .= '</div>';
					
					$div .= '<span class="postedOn">Posted on ' . date('M d', $timestamp) . ' at ' . date('h:i', $timestamp) . '</span>';
				
					if($editable) {
						$div .= '<span class="charsRemaining">250 characters remaining</span>';
						
						$div .= '<a href="#" class="save">create post</a> ';
						$div .= '<a href="#" class="cancel">cancel</a>';
						$div .= '<br />';
						
						$div .= '<a href="#" class="formatTips">?</a>';
						$div .= '<div class="clear">&nbsp;</div>';
						
						$div .= '<div class="formatDiv">';
							$div .= 'FORMATTING TIPS" <br /><br />';
							$div .= 'Type *bold* to get -> <strong>bold</strong> <br />';
							$div .= 'Type _underline_ to get -> <u>underline</u> <br />';
							$div .= 'Type +italic+ to get -> <i>italic</i> <br /><br />';
							$div .= 'Any email address and URLs entered will automatically be made clickable';
						$div .= '</div>';
					}					
				$div .= '</div>';
				
				$div .= '<div class="removeContainer">';
					$div .= '<div class="removeInner">';
						$div .= '<p>Are you sure you want to remove this post?</p>';
						$div .= '<a href="#" class="removeConfirm">remove post</a> ';
						$div .= '<a href="#" class="removeCancel">cancel</a>';
					$div .= '</div>';
				$div .= '</div>';
				
				$div .= '<div class="hover">';
					$div .= '<a href="' . $mailLink . '" title="Mail this job" class="icon mail"></a>';
					$div .= '<a href="' . $tweetLink . '" title="Tweet this job" class="icon tweet" target="_blank"></a>';
					$div .= '<a href="#" title="Delete this job" class="icon delete"></a>';
					
					if(isset($job['jobID']) && self::checkIfFlagged($job['jobID'])) {
						$div .= '<a href="#" title="This post has been flagged as inapropriate" class="icon flagged"></a>';
					} else {
						$div .= '<a href="#" title="Flag as inappropriate" class="icon flag"></a>';
					}
				$div .= '</div>';
			$div .= '</div>';
		$div .= '</div>';		
		
		return $div;
	}
	
	
	public static function shortenURL($url) {
		$key = 'R_8a34772422694afad928d1de8f84d5d3';
		$bitly = 'http://api.bit.ly/v3/shorten?login=o_2u94sccfq0&apiKey=' . $key . '&uri=' . urlencode($url) . '&format=txt';
		
		$ch = curl_init();
		$timeout = 5;
		curl_setopt($ch,CURLOPT_URL, $bitly);
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
		curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,$timeout);
		$data = curl_exec($ch);
		curl_close($ch);
		
		return $data;		  
	}
	public static function longerUrl($url) {
		$key = 'R_8a34772422694afad928d1de8f84d5d3';
		$bitly = 'http://api.bitly.com/v3/expand?login=o_2u94sccfq0&shortUrl=' . urlencode($url) . '&apiKey=' . $key . '&format=txt';
		
		$ch = curl_init();
		$timeout = 5;
		curl_setopt($ch,CURLOPT_URL, $bitly);
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
		curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,$timeout);
		$data = curl_exec($ch);
		curl_close($ch);
		
		//<a href="$1" target="_blank">$1</a>
		
		return $data;	
	}
	/**
	 * Format content
	 */
	public static function formatContent($content) {
		$content = preg_replace('#\*([^\s\*]([^\*]*[^\s\*])?)\*#is', '<strong>$1</strong>', $content);
		$content = preg_replace('#\+([^\s\*]([^\*]*[^\s\*])?)\+#is', '<i>$1</i>', $content);
		$content = preg_replace('#\_([^\s\*]([^\*]*[^\s\*])?)\_#is', '<u>$1</u>', $content);
		
		$content = preg_replace('!(((f|ht)tp://)[-a-zA-Zа-яА-Я()0-9@:%_+.~#?&;//=]+)!i', '<a href="$1" target="_blank">$1</a>', $content);
		$content = eregi_replace('([[:space:]()[{}])(www.[-a-zA-Z0-9@:%_\+.~#?&//=]+)', '\\1<a href="\\2" target="_blank">\\2</a>', $content);
	
		//$content = preg_replace('@(https?://([-\w\.]+[-\w])+(:\d+)?(/([\w/_\.#-]*(\?\S+)?[^\.\s])?)?)@', '<a href="$1" target="_blank">$1</a>', $content);
		
		$content = self::emailize($content);
		  
		//$content = preg_replace('{\b(?:(?:https?|ftp)://)\S+[.]\S+\b}i', '<a href="$0">$0</a>', $content);
		//$content = preg_replace('{\b(?<!["\'=><.])[-a-zA-Zа-яА-Яа-яА-Я()0-9@:%_+.~#?&;//=]+[.][-a-zA-Zа-яА-Яа-яА-Я()0-9@:%_+.~#?&;//=]+(?!["\'=><.])\b}i', '<a href="http://$0">http://$0</a>', $content);
		                  
		
		//$content = preg_replace('(((f|ht){1}tp://)[-a-zA-Z0-9@:%_\+.~#?&//=]+)', '<a href="\\1">\\1</a>', $content); 
		//$content = preg_replace('([[:space:]()[{}])(www.[-a-zA-Z0-9@:%_\+.~#?&//=]+)', '\\1<a href="http://\\2">\\2</a>', $content); 
		//$content = preg_replace('([_\.0-9a-z-]+@([0-9a-z][0-9a-z-]+\.)+[a-z]{2,3})', '<a href="mailto:\\1">\\1</a>', $content); 
				
		return $content;
	}
	function emailize($text) {
		$regex = '/(\S+@\S+\.\S+)/is';
		$replace = "<a href='mailto:$1'>$1</a>";
		
		$result = preg_replace($regex, $replace, $text);
		
		return $result;
	}	
}
?>
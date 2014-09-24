<?php
require_once 'class-database.php';
require_once 'class-jobs.php';

if(isset($_GET['ajax'])) {
	switch($_GET['action']) {
		// return a list of categories
		case 'getCats':
			echo json_encode(Jobs::getCats());
			break;
		case 'createJob':
			$cats = Jobs::getCats();
			
			foreach($cats as $cat) {
				$class = strtolower(str_replace(" ", "-", $cat->link));
				
				$currentCat = ($_GET['cat'] != "*" ? $_GET['cat'] : 'everything-else');
				
				if($currentCat == $class) {
					$job = array('link' => $cat->link, 'color' => $cat->color, 'content' => 'Description here', 'max' => $cat->length);
					break;
				}
			}
			
			echo Jobs::createJobView($job, true);
			break;
		case 'saveJob':
			$json = Jobs::createJob($_GET['content'], $_GET['catID']);
			echo $json;
			
			break;
		case 'checkOwnerShip':
			$jobID = $_GET['jobID'];
			
			if(Jobs::checkOwnerShip($jobID)) {
				echo 'true';
			} else {
				echo 'false';
			}
			break;
		case 'deleteJob':
			$jobID = $_GET['jobID'];
			
			if(Jobs::checkOwnerShip($jobID)) {
				Jobs::removeJobs($jobID);
				
				echo 'true';
			} else {
				echo 'false';
			}
			break;
		case 'flagJob':
			$jobID = $_GET['jobID'];
			
			if(Jobs::flagJob($jobID)) {
				// instant hide when owner
				if($_SESSION['user']['owner'] == 1 && Jobs::checkJobForFlags($jobID) > 0) {
					Jobs::hideJob($jobID);
					echo 'hide';
				} elseif(Jobs::checkJobForFlags($jobID) >= 5) {
					Jobs::hideJob($jobID);
					echo 'hide';
				} else {
					echo 'true';
				}
			} else {
				echo 'false';
			}
			break;
	}
}
?>
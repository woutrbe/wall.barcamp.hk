<?php
require_once 'class-database.php';
require_once 'class-jobs.php';

if(isset($_POST['ajax'])) {
	switch($_POST['action']) {
		// return a list of categories
		case 'getCats':
			echo json_encode(Jobs::getCats());
			break;
		case 'getJobs':
			echo json_encode(Jobs::getJobs($_POST['page']));
			break;
		case 'saveJob':
			$json = Jobs::createJob($_POST['content'], $_POST['catID']);
			echo $json;
			
			break;
		case 'checkOwnerShip':
			$jobID = $_POST['jobID'];
			
			if(Jobs::checkOwnerShip($jobID)) {
				echo 'true';
			} else {
				echo 'false';
			}
			break;
		case 'deleteJob':
			$jobID = $_POST['jobID'];
			
			if(Jobs::checkOwnerShip($jobID)) {
				Jobs::removeJobs($jobID);
				
				echo 'true';
			} else {
				echo 'false';
			}
			break;
		case 'flagJob':
			$jobID = $_POST['jobID'];
			
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
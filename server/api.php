<?php
require_once 'class-database.php';
require_once 'class-jobs.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

if(isset($request->ajax)) {
	switch($request->action) {
		// return a list of categories
		case 'getCats':
			echo json_encode(Jobs::getCats());
			break;
		case 'getJobs':
			echo json_encode(Jobs::getJobs($request->page));
			break;
		case 'getJob':
			echo json_encode(Jobs::checkJob($request->link));
			break;
		case 'saveJob':
			$json = Jobs::createJob($request->content, $request->catID);
			echo $json;
			
			break;
		case 'checkOwnerShip':
			$jobID = $request->jobID;
			
			if(Jobs::checkOwnerShip($jobID)) {
				echo 'true';
			} else {
				echo 'false';
			}
			break;
		case 'deleteJob':
			$jobID = $request->jobID;
			
			if(Jobs::checkOwnerShip($jobID)) {
				Jobs::removeJobs($jobID);
				
				echo 'true';
			} else {
				echo 'false';
			}
			break;
		case 'flagJob':
			$jobID = $request->jobID;
			
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
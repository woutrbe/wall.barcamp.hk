<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

if(!session_id()) session_start();

require_once 'class-database.php';
require_once 'class-jobs.php';
require_once 'class-user.php';
require_once 'vendor/autoload.php';

use OAuth_io\OAuth;

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

if(isset($request->ajax)) {
	$oauth = new OAuth($_SESSION['wall_login']);
	$oauth->initialize('dptmdeRHa1H18PwexEmhVUcP4OU', 'IsEjKCs96IgLUtxzZIjH0RBdlSs');

	switch($request->action) {
		// OAuth
		case 'check':
			// Check if we're already logged in
			echo json_encode($_SESSION['wall_login']);

			break;
		case 'logout':
			// Destroy the user session
			User::logout();
			break;
		case 'getServerState':
			$state = $oauth->generateStateToken();
			echo json_encode($state);

			break;
		case 'login':
			$request_object = $oauth->auth($request->service, array(
				'code' => $request->service_code
			));

			$user = $request_object->me(array(
	            'name',
	            'email',
	            'avatar',
	            'id'
	        ));

			// Both Twitter and Facebook return an ID
			// twitter_id
			// facebook_id
			if(User::checkUser($request->service, $user['raw']['id'])) {
				// User exists, return it
				$real_user = User::getUserID($request->service, $user['raw']['id']);
			} else {
				// User doesn't exist, create a new one
				$real_user = User::createUser($request->service, $user['raw']['id'], $user['name'], $user['avatar'], $user['email']);
			}

			echo json_encode($real_user);

			break;
		// return a list of categories
		case 'getCats':
			echo json_encode(Jobs::getCats());
			break;
		case 'getJobs':
			echo json_encode(Jobs::getJobs($request->page, $request->cat));
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
					echo 'true';
				} elseif(Jobs::checkJobForFlags($jobID) >= 5) {
					Jobs::hideJob($jobID);
					echo 'true';
				} else {
					echo 'flag';
				}
			} else {
				echo 'false';
			}
			break;
	}
}
?>
<?php
require_once 'vendor/autoload.php';

use OAuth_io\OAuth;

$oauth = new OAuth();
$oauth->initialize('dptmdeRHa1H18PwexEmhVUcP4OU', 'IsEjKCs96IgLUtxzZIjH0RBdlSs');
$state = $oauth->generateStateToken();
?>
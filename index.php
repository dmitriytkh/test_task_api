<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, POST, DELETE, PUT');
	require_once ("Api.php");
	$db = Api::connection_db();
?>
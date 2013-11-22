<?php header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
require("connect.php");

$data = file_get_contents("php://input");
$postData = json_decode($data);
$userID = $postData->userid;
$userName = $postData->username;
$userEmail = $postData->email;

if(isset($userID, $userName, $userEmail)){
	$query = "INSERT INTO Users (userID, Name, Email) VALUES ('$userID', '$userName', '$userEmail')";
	if(mysqli_query($dbConnection, $query)){
		echo "user added to db!";
	}
	else{
		echo "add user failed";
	}
} 
?>
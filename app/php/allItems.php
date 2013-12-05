<?php header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
	require("connect.php");

$userID = $_GET['userid'];
$outputArray = array();
$query = "SELECT distinct name from Item,Receipt WHERE (userId = '$userID') AND (Item.receiptId = Receipt.receiptId)";
$result = mysqli_query($dbConnection, $query);

while($row = mysqli_fetch_array($result)){
	array_push($outputArray,array('name'=>$row[0]));
}

//outputs an array of json objects of all items the user bought
echo json_encode($outputArray);
?>
<?php header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
require("connect.php");

$data = file_get_contents("php://input");
$postData = json_decode($data);
$userID = $postData->userid;
$receiptId = $postData->receiptID;

$delete_item_query = "DELETE FROM Item WHERE receiptId = $receiptId";
$delete_receipt_query = "DELETE FROM Receipt WHERE receiptId = $receiptId";

if(mysqli_query($dbConnection, $delete_item_query)){
	if(mysqli_query($dbConnection, $delete_receipt_query)){

		echo "SUCCESS";
	}
}


?>
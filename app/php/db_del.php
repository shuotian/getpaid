<?php header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
require("connect.php");

$userID = 1;
$data = file_get_contents("php://input");
$receiptId = json_decode($data);

$delete_item_query = "DELETE FROM Item WHERE receiptId = $receiptId";
$delete_receipt_query = "DELETE FROM Receipt WHERE receiptId = $receiptId";

if(mysqli_query($dbConnection, $delete_item_query)){
	if(mysqli_query($dbConnection, $delete_receipt_query)){

		echo "SUCCESS";
	}
}


?>
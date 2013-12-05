<?php header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
	require("connect.php");

$userID = $_GET['userid'];
$itemName = $_GET['itemName'];
$query = "SELECT * FROM Item WHERE (name = '$itemName') AND Item.receiptId in (SELECT receiptId FROM Receipt WHERE (userId = '$userID')) AND (Item.receiptId = Receipt.receiptId)";

?>
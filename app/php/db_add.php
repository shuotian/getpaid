<?php header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
require("connect.php");

//pre set userid as 1 for now


$data = file_get_contents("php://input");
$postData = json_decode($data);

	//main receipt details
$storeName = $postData->storename;
$receiptDate = $postData->receiptDate;
$paid = $postData->paid;
$total = $postData->total;
$shared = $postData->sharedReceipt;
$items = $postData->items;
$userID = $postData->userid;
$multiquery = "";

if(isset($storeName, $receiptDate, $paid, $total, $shared)){
	$query = "INSERT INTO Receipt (receiptId, userId, total, shared, receiptDate, storeName, paid) VALUES (NULL, '$userID', '$total', '$shared', '$receiptDate', '$storeName', '$paid')";
	mysqli_query($dbConnection, $query);
	//gets the new receipt id generated
	$newReceiptId = mysqli_insert_id($dbConnection);

	//adds item to the items table based on the new receipt id.
	//iterates through the items list and append each item to a query which we will add to a multiquery
	foreach($items as $item){
		if(isset($newReceiptId, $item->quantity, $item->cost)){
			$multiquery .= "INSERT INTO Item (name, receiptId, itemId, numberOfItems, cost, payerNumber) VALUES ('$item->name', '$newReceiptId', NULL, '$item->quantity','$item->cost', 0);";
		}
	}
mysqli_multi_query($dbConnection, $multiquery);
	//executes multi query
	echo $multiquery;
}
?>
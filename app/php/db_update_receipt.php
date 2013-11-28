<?php header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
require("connect.php");

$data = file_get_contents("php://input");
$postData = json_decode($data);
$receiptId = $postData->receiptId;
$itemsToUpdate = $postData->paid;
$multiquery = "";
$query = "";


foreach($itemsToUpdate as $item){
	
	$multiquery.="UPDATE Item SET paid = 1 WHERE itemId = '$item';";
}
//successfully updated the paid items in database
mysqli_multi_query($dbConnection, $multiquery);
//frees the results from the multiquery
do {
    if($result = mysqli_store_result($dbConnection)){
        mysqli_free_result($result);
    }
} while(mysqli_next_result($dbConnection));

if(mysqli_error($dbConnection)) {
    die(mysqli_error($dbConnection));
}

	
	//checks if all items have been paid for the receipt. if yes, update receipt table
	if(isset($receiptId))
		$query = "SELECT paid FROM Item WHERE receiptId='$receiptId'";
	else
		echo "QUERY invalid";
	echo $query;
 	$result = mysqli_query($dbConnection, $query) or die("Selection Query Failed !!!");
 	while($row = mysqli_fetch_array($result)){
 		if($row[0]==0){
 			exit("Receipt not fully paid");
 		}
 	}
 	//all receipts fully paid at this point
 	$updateReceiptQuery = "UPDATE Receipt SET paid = 1 WHERE receiptID = $receiptId";
 	if(mysqli_query($dbConnection,$updateReceiptQuery)){
 		echo "receipt table updated";
 	}



?>
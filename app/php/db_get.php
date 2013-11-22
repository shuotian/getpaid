<?php header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
	require("connect.php");

	
	$userID = $_GET['userid'];
	$outputArray = array();
	$receipt = array();
	
	$result = mysqli_query($dbConnection,"SELECT receiptid,storeName,total,paid,receiptDate FROM Receipt WHERE userId = $userID");

	//each $row is an array of details from Receipts table that matches our userID
	while($row = mysqli_fetch_array($result))
  	{
  		$receiptID = $row[0];
  		//Query to get all items based on current $receiptID
  		$itemQuery = mysqli_query($dbConnection,"SELECT name, cost FROM Item WHERE receiptId = $receiptID"); 

  		$receipt['id']=$row[0];
  		$receipt['store'] = $row[1];
  		$receipt['amount'] = $row[2];
  		$receipt['paid'] = $row[3];
      $receipt['receiptDate']=$row[4];
  		$receipt['items'] = array();
  		while($itemRow = mysqli_fetch_array($itemQuery)){
  			$receipt['items'][$itemRow[0]] = $itemRow[1];
  		}
  		$outputArray[$receiptID]=$receipt;
  		$receipt = array();
  	}
  	echo json_encode($outputArray);
?>
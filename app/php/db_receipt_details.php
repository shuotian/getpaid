<?php header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
require("connect.php");

$data = file_get_contents("php://input");
$postData = json_decode($data);
$userID = $_GET["userid"];
$receiptId = $_GET["receiptid"];

if(isset($receiptId,$userID)){
$query = "SELECT name, cost, Payers.payerNumber, payerName, itemId, paid FROM Item,Payers WHERE (receiptId = '$receiptId') AND (Item.payerNumber = Payers.payerNumber)";
$result = mysqli_query($dbConnection, $query) or die("Selection Query Failed !!!");;
}

$item = array();
$output = array();


while($row = mysqli_fetch_array($result)){

	$item['name'] = $row[0];
	$item['cost'] = $row[1];
	$item['payerNumber'] = $row[2];
	$item['payerName'] = $row[3];
	$item['itemId'] = $row[4];
	$item['paid'] = $row[5];
	array_push($output, $item);
	
}
echo json_encode($output);

?>
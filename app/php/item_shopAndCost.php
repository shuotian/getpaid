<?php header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  require("connect.php");

$userID = $_GET['userid'];
$itemName = $_GET['itemName'];
$outputArray = array();
$query = "SELECT Distinct storeName, receiptDate, cost FROM Item,Receipt WHERE (name = '$itemName') AND Item.receiptId in (SELECT receiptId FROM Receipt WHERE (userId = '$userID')) AND (Item.receiptId = Receipt.receiptId) ORDER BY receiptDate DESC ";
$result = mysqli_query($dbConnection, $query);
while($row = mysqli_fetch_array($result)){
  array_push($outputArray,array('storeName'=>$row[0],'receiptDate'=>$row[1], 'cost'=>$row[2]));
}
echo json_encode($outputArray);
?>
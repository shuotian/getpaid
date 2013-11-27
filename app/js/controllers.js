var getpaidControllers = angular.module('getpaidControllers', ['facebook']);
/*
 * Session variables used:
 * localStorage.userid - stores current user id
 * localStorage.email - stores user's email
 * localStorage.username - stores user's name
 * localStorage.friends - stores list of user's friends
 */

//runs whenever the app gets starts up
getpaidControllers.run(function($rootScope,$location, Facebook){
	if(localStorage.userid === undefined){
		console.log("user id is null");
		$location.path('/login');
	}
	else{
		$location.path('/receipts');
	}
		
	
});

//Service which returns all the receipts of the current user
getpaidControllers.factory('receiptDataSvc', function($http) {
	return {
		getReceipts: function() {
			return $http.get('https://web.engr.illinois.edu/~heng3/getpaid/app/php/db_get.php',{params:{userid:localStorage.userid}}).then(function(result) {
				return result.data;
			});
		}
	}
});

//Service which returns the details of current receipt
getpaidControllers.factory('receiptDetailSvc', function($http) {
	return {
		getDetails: function(value) {
			return $http.get('https://web.engr.illinois.edu/~heng3/getpaid/app/php/db_receipt_details.php',{params:{userid:localStorage.userid,receiptid:value}}).then(function(result) {
				return result.data;
			});
		}
	}
});



getpaidControllers.config(['FacebookProvider',
	function(FacebookProvider){
		var myAppId = '178741542323645';
		 FacebookProvider.init(myAppId);
	}]);

getpaidControllers.directive('debug', function() {
		return {
			restrict:	'E',
			scope: {
				expression: '=val'
			},
			template:	'<pre>{{debug(expression)}}</pre>',
			link:	function(scope) {
				// pretty-prints
				scope.debug = function(exp) {
					return angular.toJson(exp, true);
				};
			}
		}
	});

/* Controllers */

//Facebook login adapted from https://github.com/Ciul/angular-facebook
getpaidControllers.controller('LoginCtrl',['$scope', '$timeout', 'Facebook','$location','$http','$rootScope',
	function($scope, $timeout, Facebook, $location, $http,$rootScope){
		console.log(localStorage.userid);
		if(localStorage.userid===undefined){
			$location.path('/login');
		}
		// Define user empty data :/
      $scope.user = {};
      
      // Defining user logged status
      $scope.logged = false;
      
      // And some fancy flags to display messages upon user status change
      $scope.byebye = false;
      $scope.salutation = false;

      /**
       * Watch for Facebook to be ready.
       * There's also the event that could be used
       */
      $scope.$watch(
        function() {
          return Facebook.isReady();
        },
        function(newVal) {
          if (newVal)
            $scope.facebookReady = true;

        }
      );
      
      /**
       * IntentLogin
       */
      $scope.IntentLogin = function() {
        Facebook.getLoginStatus(function(response) {
          if (response.status == 'connected') {
            $scope.logged = true;
            $scope.me(0);
            $scope.friends();
            localStorage.loggedin = true;
            var delay = 1000;
            setTimeout(function(){
            	$location.path('/receipts');
            },delay);
            
          }
          else
            $scope.login();

        });
      };
      
      /**
       * Login
       */
       //New user
       $scope.login = function() {
         Facebook.login(function(response) {
          if (response.status == 'connected') {
          	$scope.logged = true;
            $scope.me(1);
            $scope.friends();
            localStorage.loggedin = true;
            var delay = 1000;
            setTimeout(function(){
            	$location.path('/receipts');
            },delay);
          }
        },{ scope: 'email' });
       };
       
       /**
        * me 
        */
        $scope.me = function(newuser) {
          Facebook.api('/me', function(response) {
            /**
             * Using $scope.$apply since this happens outside angular framework.
             */
            $scope.$apply(function() {
              $scope.user = response;
            
            });
            localStorage.userid = response.id;
            localStorage.username = response.name;
            localStorage.email = response.email;
            if(newuser==1){
            var data ={
            	userid: localStorage.userid,
            	username: localStorage.username,
            	email: localStorage.email
            };
            console.log(data);
            //add user to sql database as new user
          	$http.post('https://web.engr.illinois.edu/~heng3/getpaid/app/php/db_addNewUser.php',data)
				.success(function(response,status){
					console.log(response);
				})
				.error(function(response, status) {
     			// this isn't happening:
     			console.log(response);
   				});
			}
          });
        };

        $scope.friends = function(){
        	FB.api('/me/friends', {fields: 'name,id,location,birthday'}, function(response) {
        		$scope.$apply(function() {
        		$scope.friends = response;
        		localStorage.friends = angular.toJson(response.data);
 				//console.log(localStorage.friends);
        		});
			});
        };
        /**
       * Logout
       */
      $rootScope.logout = function() {
              console.log("hello world");
        	Facebook.logout(function() {
          	$scope.$apply(function() {
            $scope.user   = {};
            $scope.friends = {};
            $scope.logged = false;
          	alert(localStorage.userid);
          
          });

        });

        localStorage.clear();
        console.log(localStorage.userid);
        $location.path('/login');
      }
      /**
       * Taking approach of Events :D
       */
      $scope.$on('Facebook:statusChange', function(ev, data) {
        console.log('Status: ', data);
        if (data.status == 'connected') {
          $scope.$apply(function() {
            $scope.salutation = true;
            $scope.byebye     = false;
            localStorage.userid = data.authResponse.userID;
            //console.log(localStorage.friends);
            if(localStorage.loggedin==true){
            	$location.path('/receipts');
            }

          });
        } else {
          $scope.$apply(function() {
            $scope.salutation = false;
            $scope.byebye     = true;
            
            // Dismiss byebye message after two seconds
            $timeout(function() {
              $scope.byebye = false;
            }, 2000)
          });
        }
      });
	}]);

//loads all the receipts in the main page
getpaidControllers.controller('ReceiptListCtrl', ['$scope', '$location','receiptDataSvc','$http',
	function($scope,$location,receiptDataSvc, $http) {
		console.log(localStorage.userid);
		if(localStorage.userid==null){
			location.reload();
		}
		receiptDataSvc.getReceipts().then(function(data){
			console.log(data);
			$scope.receipts = data;
			$scope.username = localStorage.username;
			$scope.total = getTotal(data);
		});

		//console.log(localStorage.friends);
    //to be directed to detailed receipt page when a receipt is clicked on the main page
    $scope.receiptClicked = function(receiptId){
    	$location.path('/receipts/'+receiptId.toString());
    }

    $scope.deleteReceipt = function(receiptId){
    	var data = {
    		receiptID: receiptId,
    		userid: localStorage.userid
    	};
    	var receipt;
    	for(var key in $scope.receipts){
    		if($scope.receipts[key].id == receiptId){
    			//alert("Delete receipt " + $scope.receipts[i].store + " ?");
    			receipt = $scope.receipts[key].store;
    		}
    	}
    	//receipt.isDisabled = true;
    	if(confirm("Delete receipt " + receipt + " ?")){
    	
    		$http.post('https://web.engr.illinois.edu/~heng3/getpaid/app/php/db_del.php',data)
				.success(function(response,status){
					console.log(response);
					location.reload();
				})
				.error(function(response, status) {
     			// this isn't happening:
     			console.log(response);
   				});
			}
		else{
			receipt.isDisabled = false;
			$location.path('/receipts');
			return;
		}
    }

}]);

//changes the view to the detailed receipt view based on the receiptId
getpaidControllers.controller('ReceiptDetailCtrl',['$scope','$routeParams', 'receiptDetailSvc', '$location',
	function($scope, $routeParams, receiptDetailSvc, $location){

		$scope.receiptId = $routeParams.receiptId;
		var receiptId = $scope.receiptId;
		console.log(receiptId);
		receiptDetailSvc.getDetails(receiptId).then(function(data){
			if(data.length==0){
				$scope.total = 0;
				return;
			}
			//iterates through the array of receipts, if our receiptid matches the receiptid found in the array, use that receipt
			$scope.receipt = data;
			var total = 0;
			for(var i =0; i < data.length; i++){
				total += parseFloat(data[i].cost);
			}
			console.log(total);
			$scope.total = total;
			console.log($scope.receipt);
		});
		$scope.edit = function(id){
			$location.path('/receipts/edit/'+id);
			//alert("change path" + id);
		}
		$scope.sendFbMsg = function(payerId){
			FB.ui({
  			method: 'send',
  			link: 'http://www.nytimes.com/2011/06/15/arts/people-argue-just-to-win-scholars-assert.html',
  			to:payerId
			});
		}

	}]);

//Controller to create a new receipt and add it to the database
getpaidControllers.controller('NewReceiptCtrl',['$scope','$http',
	function($scope,$http){
		var master = {
			storename:'',
			receiptDate:'',
			paid:'',
			sharedReceipt:'',
			total:0.00,
			items:[]
		};

		var resetNewItemFd = {
			name:'',
			quantity:'',
			cost:0.00,
			shared:'',
			users:[]
		};

		var friends = {
			data:JSON.parse(localStorage.friends)
		}
		$scope.friends = friends;
		console.log($scope.friends);
		
		//resets the form to the default settings
		$scope.cancel = function() {
			$scope.form = angular.copy(master);
			$scope.newItem = angular.copy(resetNewItemFd);
		};

		$scope.save = function() {
			var data = $scope.form;
			data.userid = localStorage.userid;
			//sends the whole array of item objects to server for insertion into database.
			/*1) insert new receipt into db first (should get unique receiptid back)
			  2) insert payers into db with itemid and receiptid (should get unique payer number back)
			  3) insert items into db with the returned receiptid and payer number
			*/
			console.log(data);
			$http.post('https://web.engr.illinois.edu/~heng3/getpaid/app/php/db_add.php',data)
			.success(function(response,status){
				console.log(response);
				alert("Receipt Added!");
			})
			.error(function(response, status) {
     		// this isn't happening:
     		console.log(response);
   			});
			$scope.cancel();
		};

		$scope.addItem = function(newitem) {
			$scope.form.items.push(newitem);
			$scope.form.total+=parseFloat(newitem.cost);
			$scope.newItem = angular.copy(resetNewItemFd);
			$scope.payer='';
		};

		$scope.addSharedUser = function(item,username,id){
			var payer = {
				name:username,
				id:id
			}
			item.users.push(payer);
			$scope.payer='';
			$scope.pyerid = '';
		};

		$scope.removeItem = function(index) {
			$scope.form.items.splice(index, 1);
		};

		//by default if it is a shared receipt, paid will be set as false and vice versa.
		$scope.receiptPaid = function(obj, value){
			if(obj=="item"){
				if(value === 'Yes'){
					$scope.form.paid = 0;
				}
				else{
					$scope.form.paid = 1;
				}
			}
			else
				$scope.form.sharedReceipt = value;
			console.log(value);
		};

		$scope.attach=function(value,id){
			$scope.payer = value;
			$scope.payerid = id;
		};

		$scope.cancel();
	}]);

	//TODO Add edit controller

//Miscellaneous functions
//function to retrieve the total expenditure for the month.
function getTotal(data){
	var total = 0;
	for(var key in data){

		total+=parseFloat(data[key].amount);
	}
	return total;
}
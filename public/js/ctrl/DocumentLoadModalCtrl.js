app.controller("DocumentLoadModalCtrl", function($scope, $uibModalInstance, $firebaseArray, Auth){

	console.log("DocumentLoadModalCtrl");

	$scope.reload = function()
	{
		console.log($scope.firebaseUser.uid)
		var ref = firebase.database().ref();
		$scope.documents = $firebaseArray(ref.child('user_data').child($scope.firebaseUser.uid).child('documents'));

	}

	$scope.onClickLoad = function(doc)
	{
		$uibModalInstance.close(doc.$id);
	}

	$scope.onClickDelete = function(doc)
	{
		if(confirm("Delete document '"+doc.name+"' are you sure?"))
		{
			$scope.documents.$remove(doc);
		}
	}

	$scope.auth = Auth;
	$scope.auth.$onAuthStateChanged(function(firebaseUser)
	{
		if(firebaseUser)
		{
			$scope.firebaseUser = firebaseUser;
			$scope.reload();
		}
	});

	
})
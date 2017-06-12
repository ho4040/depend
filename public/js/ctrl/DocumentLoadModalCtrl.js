app.controller("DocumentLoadModalCtrl", function($scope, $uibModalInstance, $firebaseArray, Auth){

	console.log("DocumentLoadModalCtrl");

	$scope.reload = function()
	{

		console.log($scope.firebaseUser.uid)
		var ref = firebase.database().ref();
		$scope.documents = $firebaseArray(ref.child('user_data').child($scope.firebaseUser.uid).child('documents'));

	}

	$scope.onClickLoad = function(idx)
	{
		$uibModalInstance.close($scope.documents[idx]);
	}

	$scope.onClickDelete = function(doc)
	{
		if(prompt("Delete document. are you sure?"))
		{
			$scope.documents.$remove(index);
		}
	}

	$scope.auth = Auth;
	$scope.auth.$onAuthStateChanged(function(firebaseUser)
	{
		$scope.firebaseUser = firebaseUser;
		$scope.reload();
	});

	
})
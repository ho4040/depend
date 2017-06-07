app.controller("DocumentSaveModalCtrl", function($scope, $uibModalInstance, $firebaseArray, Auth, eles, rootName){

	$scope.auth = Auth;

	$scope.input = {
		name:rootName
	}

	$scope.auth.$onAuthStateChanged(function(firebaseUser) {
		$scope.firebaseUser = firebaseUser;
		var ref = firebase.database().ref();
		$scope.documents = $firebaseArray(ref.child('user_data').child($scope.firebaseUser.uid).child('documents'));
	});

	$scope.onClickSave = function(idx)
	{
		var doc = $scope.documents[idx];
		doc.graph_eles = eles;
		$scope.documents.$save(doc);
		$uibModalInstance.close();
	}
	

	$scope.onClickSaveAs = function(){
		
		if(!$scope.input.name)
		{
			alert("name required!");
			return;
		}

		$scope.documents.$add({name:$scope.input.name, graph_eles:eles});
		$uibModalInstance.close();
	}

})
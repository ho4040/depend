app.controller("DocumentSaveModalCtrl", function($scope, $uibModalInstance, $firebaseArray, Auth, eles, rootName){

	$scope.auth = Auth;
	$scope.saving = false;

	$scope.input = {
		name:rootName
	}

	$scope.auth.$onAuthStateChanged(function(firebaseUser) {
		if(firebaseUser)
		{
			$scope.firebaseUser = firebaseUser;
			var ref = firebase.database().ref();
			$scope.documents = $firebaseArray(ref.child('user_data').child($scope.firebaseUser.uid).child('documents'));
		}
	});

	$scope.onClickSave = function(idx)
	{
		var doc = $scope.documents[idx];
		doc.graph_eles = eles;
		$scope.saving = true;
		$scope.documents.$save(doc).then(e=>{
			$scope.saving =false;
			$uibModalInstance.close(doc.$id);
		})
	}
	

	$scope.onClickSaveAs = function(){
		
		if(!$scope.input.name)
		{
			alert("name required!");
			return;
		}
		var doc = {name:$scope.input.name, graph_eles:eles};
		$scope.saving =true;
		$scope.documents.$add(doc).then(ref=>{
			var docId = ref.key;
			$scope.saving = false;
			$uibModalInstance.close(docId);
		})
	}

})
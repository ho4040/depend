app.controller("NodeSelectModalCtrl", function($scope, $uibModalInstance, title, nodes){

	$scope.title = title;
	$scope.nodes = nodes;

	$scope.submit = function(){
		var selectedNodes = $scope.nodes.filter(e=>{
			return !!e.selected;
		});
		$uibModalInstance.close(selectedNodes);
	}
	$scope.cancel = function()
	{
		$uibModalInstance.dismiss();
	}
	
})
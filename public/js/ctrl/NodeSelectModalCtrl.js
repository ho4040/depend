app.controller("NodeSelectModalCtrl", function($scope, $uibModalInstance, nodes, selectedNode){

	$scope.nodes = nodes;
	$scope.selectedNode = selectedNode;

	console.log(nodes, selectedNode);

	$scope.onClick = function(node){
		$uibModalInstance.close(node);
	}
	
})
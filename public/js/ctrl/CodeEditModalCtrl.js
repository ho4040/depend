app.controller("CodeEditModalCtrl", function($scope, $uibModalInstance, eles){

	$scope.input = {};
	$scope.input.code = JSON.stringify(eles, null, 4);

	$scope.submit = function()
	{
		try
		{
			var obj  = JSON.parse($scope.input.code);
			$uibModalInstance.close(obj);

		}
		catch(e)
		{
			alert("syntax error!");
			console.log(e);
		}
	}

	$scope.cancel = function()
	{
		$uibModalInstance.dismiss("cancel");
	}
	
})
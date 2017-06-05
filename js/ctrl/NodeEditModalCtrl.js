app.controller("NodeEditModalCtrl", function($scope, $uibModalInstance, item, title){

	$scope.item = item;
	$scope.opt = {
		title:title
	};
	$scope.lastKeyState = {};

	$scope.onKeyDown = function(event) 
	{

		var state = {
				shift:event.shiftKey, 
				ctrl:event.ctrlKey, 
				alt:event.altKey, 
				keyCode:event.keyCode
		}

		if(JSON.stringify($scope.lastKeyState) != JSON.stringify(state))
		{

			$scope.lastKeyState = state;

			if(!!state.ctrl && state.keyCode == 13) //ctrl + space
			{
				$scope.submit();
			}

		}

		event.stopPropagation();
		
	}

	$scope.submit = function()
	{	
		if($scope.item.name == ""){
			alert("please input node name.");
			return;
		}
		console.log('node-edit-modal on key up');
		$uibModalInstance.close($scope.item);
	}

	$scope.cancel = function()
	{
		$uibModalInstance.dismiss('cancel');	
	}

	$scope.bFocus = true;

})
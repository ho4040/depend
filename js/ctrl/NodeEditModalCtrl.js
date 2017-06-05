app.controller("NodeEditModalCtrl", function($scope, $uibModalInstance, item, title){

	$scope.item = item;
	$scope.lastKeyState = {};	
	$scope.opt = {
		title:title
	};

	$scope.onKeyDown = function(event) {

		var state = {
				shift:event.shiftKey, 
				ctrl:event.ctrlKey, 
				alt:event.altKey, 
				keyCode:event.keyCode
		}
		
		if( JSON.stringify($scope.lastKeyState) != JSON.stringify(state))
		{
			$scope.lastKeyState = state;

			if(!!state.ctrl && state.keyCode == 13) //ctrl + space
			{
				$uibModalInstance.close($scope.item);
			}
		}
		
	}

	$scope.opened = true;

})
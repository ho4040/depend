app.controller("NodeEditModalCtrl", function($scope, $uibModalInstance, item, title){

	$scope.item = item;
	$scope.opt = {
		title:title
	};

	$scope.onKeyUp = function(event) {


		var state = {
				shift:event.shiftKey, 
				ctrl:event.ctrlKey, 
				alt:event.altKey, 
				keyCode:event.keyCode
		}

		if(!!state.ctrl && state.keyCode == 13) //ctrl + space
		{
			console.log('node-edit-modal on key up');
			$uibModalInstance.close($scope.item);
		}
		
		event.stopPropagation();
	}

	$scope.opened = true;

})
app.controller('MainCtrl', function($scope, $uibModal, cytoData){

	$scope.layoutState = {
		list:[
			{name: 'cose', animate:true},
			{name: 'circle', animate:true},
			{name: 'breadthfirst', animate:true},
			{name: 'grid', animate:true}
		],
		currentIndex:0

	}

	
	$scope.modalInstance = null;

	//cytoData 에서 그래프 컨트롤을 위한 객체를 가져온다. 당장은 필요 없음.
	cytoData.getGraph('core').then(function(graph){
		$scope.graph = graph;
	});


	$scope.cy = {
		elements:[
			{ group:'nodes',data: { id: 'node1', name: 'root', content:"hello" }, selectable:true, selected:true },
			/*{ group:'nodes',data: { id: 'node2', name: '2222'} },
			{ group:'nodes',data: { id: 'node3', name: '33333' } },
			{ group:'edges',data: { id: 'link1', source:'node1', target:'node2' }},
			{ group:'edges',data: { id: 'link2', source:'node2', target:'node3' }}*/
		],
		style : [
			{
			 	selector: 'node',
				style: {
					'content': 'data(name)',
					'text-valign': 'center',
					'color': 'white',
					'text-outline-width': 2,
					'text-outline-color': '#888'
				}
			},{
				selector: ':selected',
				style: {
					'content': 'data(name)',
					'text-valign': 'center',
					'color': 'white',
					'text-outline-width': 2,
					'text-outline-color': '#09f'
				}
			}

		],
		layout : $scope.layoutState.list[$scope.layoutState.currentIndex],
		selectionType:'single'
	};

	


	$scope.onKeyUp = function(event) {

		if(!!$scope.modalInstance)
			return;
		
		var state = {
				shift:event.shiftKey, 
				ctrl:event.ctrlKey, 
				alt:event.altKey, 
				keyCode:event.keyCode
		}
		
		console.log(state);

		if(!!state.ctrl && state.keyCode == 32) //ctrl + space
		{
			$scope.editNode();			
		}
		else if(!!state.ctrl && state.keyCode == 45) //ctrl + Insert
		{
			$scope.addNewNode();
		}	
		else if(!!state.ctrl && state.keyCode == 190) //ctrl+.
		{
			$scope.nextLayout();
		}
		else if(state.keyCode == 46) // delete
		{
			$scope.delete();
		}
		
	}

	$scope.nextLayout = function()
	{

		$scope.layoutState.currentIndex = ($scope.layoutState.currentIndex+1) % $scope.layoutState.list.length;
		var layout = $scope.layoutState.list[$scope.layoutState.currentIndex];
		console.log("layout update", layout, $scope.layoutState.currentIndex);
		
		$scope.updateLayout(angular.copy(layout));
	}

	$scope.updateLayout = function(layout)
	{	
		if(!!layout)
			$scope.cy.layout = layout;
		else
			$scope.cy.layout = angular.copy($scope.cy.layout);
	}

	$scope.delete = function()
	{
		$scope.graph.$(":selected").remove();
	}

	$scope.editNode = function()
	{
		var data = $scope.graph.$(":selected").data();
		//console.log(selectedNode);

		$scope.modalInstance = $uibModal.open({
			size:"lg",
			backdrop:true,
			templateUrl:"js/view/node-edit-modal-view.html",
			controller:"NodeEditModalCtrl",
			resolve:{
				item:function(){ return data; },
				title:function(){ return 'edit'; }
			}
		});

		$scope.modalInstance.result.then(resultData=>{

			//Add Node
			console.log("edited");			
			$scope.graph.$(":selected").data(resultData);
			$scope.modalInstance = null;

		}, dismissed=>{
			console.log("dismissed");
			$scope.modalInstance = null;

		})
	}


	$scope.addNewNode = function()
	{
		
		//console.log(selectedNode);

		var newNodeId = 'n'+moment().format('YYYYMMDDHHmmss');
		var newLinkId = 'l'+moment().format('YYYYMMDDHHmmss');

		$scope.modalInstance = $uibModal.open({
			size:"lg",
			backdrop:true,
			templateUrl:"js/view/node-edit-modal-view.html",
			controller:"NodeEditModalCtrl",
			resolve:{
				item:function(){ 					
					return {id:newNodeId, name:"new node", content:"empty content"}; 
				},
				title:function(){ return 'Add node'; }
			}
		});

		$scope.modalInstance.result.then(resultData=>{

			var parent = $scope.graph.$(":selected").data();

			var childNode = { group:'nodes',data: resultData, selectable:true, selected:true };
			var edge = { group:'edges',data: { id: newLinkId, source:resultData.id, target:parent.id }}

			//Add Node
			console.log("added");

			$scope.graph.$(":selected").unselect();
			$scope.graph.add([childNode, edge]);

			$scope.graph.$(":visible").layout($scope.layoutState.list[$scope.layoutState.currentIndex]);
			
			
			$scope.modalInstance = null;

		}, dismissed=>{
			console.log("dismissed");
			$scope.modalInstance = null;

		})
	}





});


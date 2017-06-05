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

	$scope.lastKeyStae = {};

	
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

	
	$scope.onKeyDown = function(event) {

		if(!!$scope.modalInstance)
			return;
		
		var state = {
				shift:event.shiftKey, 
				ctrl:event.ctrlKey, 
				alt:event.altKey, 
				keyCode:event.keyCode
		}

		if(JSON.stringify($scope.lastKeyStae) != JSON.stringify(state))
		{
			
			$scope.lastKeyStae = state;

			console.log("main-keyup", state);
			if(!!state.ctrl && state.keyCode == 13) //ctrl + space
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
			else if(state.keyCode == 38) // up
			{
				$scope.select({x:0,y:-1});
			}
			else if(state.keyCode == 40) // down
			{
				$scope.select({x:0,y:1});
			}
			else if(state.keyCode == 37) // left
			{
				$scope.select({x:-1,y:0});
			}
			else if(state.keyCode == 39) // right
			{
				$scope.select({x:1,y:0});	
			}
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

	

	$scope.select = function(dir) //방향에 따라 선택해준다.
	{

		sub = function(a, b) {
			return {x:(a.x - b.x ), y:(a.y-b.y)}
		}

		len = function( p ) {
			return Math.sqrt(p.x*p.x + p.y*p.y);
		}

		normalize = function( p ){
			var l = len(p);
			return {x:(p.x/l), y:(p.y/l)};
		}

		dot = function(a, b){
			return (a.x*b.x) + (a.y*b.y);
		}


		var selectedItem = $scope.graph.$(":selected");
		if(selectedItem.length == 0)
		{
			console.log(selectedItem);
			return;
		}

		//console.log(selectedItem);

		var selectedItemPos = selectedItem.position();
		var selectedItemData = selectedItem.data();
		//console.log(selectedItemPos);

		var found = $scope.graph.nodes().max(function(ele, idx, arr){

			var data = ele.data();
			var p = ele.position();
			var j = ele.json();

			if(data.id == selectedItemData.id){
				//console.log(data.id, "pass");
				return -1;
			}

			var v1 = dir;
			var v2 = normalize(sub(p, selectedItemPos));
			var dist = len(sub(selectedItemPos, p));
			var weight = dot(v1,v2) / Math.sqrt(dist); //가까운거에 더 가중치를 준다.

			//console.log(data.id, orth);
			return weight;
		})

		//console.log(found);
		if(found.value > 0) {
			found.ele.select();
			selectedItem.unselect();
		}
		//$scope.graph.nodes
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


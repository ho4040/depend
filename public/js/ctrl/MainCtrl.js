app.controller('MainCtrl', function($rootScope, $scope, $uibModal, cytoData, Auth, $timeout, $firebaseArray){

	$scope.auth = Auth;	
	$scope.input = {
		autoSave: true
	},
	$scope.lastSavedDataHash = "";
	$scope.firebaseUser = null;
	$scope.authError = null;
	$scope.currentDoc = null;

	$scope.selected = {
		element:null,
		data: null
	}

	$scope.layoutState = {
		list:[
			{name: 'cose', animate:true},
			/*{name: 'circle', animate:true},
			{name: 'breadthfirst', animate:true},*/
			/*{name: 'grid', animate:true}*/
		],
		currentIndex:0

	}

	$scope.lastKeyState = {};



	
	$scope.modalInstance = null;

	//cytoData 에서 그래프 컨트롤을 위한 객체를 가져온다. 당장은 필요 없음.
	cytoData.getGraph('core').then(function(graph){
		$scope.graph = graph;
	});


	$scope.cy = {
		/*elements:[
			{ group:'nodes',data: { id: 'root', name: 'root', content:"hello" }, selectable:true, selected:true },
			{ group:'nodes',data: { id: 'node2', name: '2222'} },
			{ group:'nodes',data: { id: 'node3', name: '33333' } },
			{ group:'edges',data: { id: 'link1', source:'node1', target:'node2' }},
			{ group:'edges',data: { id: 'link2', source:'node2', target:'node3' }}
		],*/
		style : [
			{
			 	selector: 'node',
				style: {
					'content': 'data(name)',
					'text-valign': 'center',
					'width': 'data(size)',
					'height': 'data(size)',
					'color': 'white',
					'text-outline-width': 2,
					'text-outline-color': '#888',
					'background-color':'#888'
				}
			},
			{
				selector: ':selected',
				style: {
					'content': 'data(name)',
					'text-valign': 'center',
					'color': 'white',
					'text-outline-width': 2,
					'text-outline-color': '#09f',
					'background-color':'#555',
					'border-width':4,
					'border-color':'#09f',
				}
			},
			{
				selector: 'edge',
				style: {
					'width': 3,
					'line-color': '#ccc',
					'curve-style': 'unbundled-bezier',
					'target-arrow-color': '#09f',
					'target-arrow-shape': 'triangle',
					'source-arrow-color': '#888',
					'source-arrow-shape': 'circle'
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

		if(JSON.stringify($scope.lastKeyState) != JSON.stringify(state))
		{
			
			$scope.lastKeyState = state;

			//console.log("main-keyup", state);
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
				$scope.updateLayout();
			}
			else if(state.keyCode == 46) // delete
			{
				$scope.delete();
			}
			else if(state.keyCode == 38) // up
			{
				$scope.selectWithDirection({x:0,y:-1});
			}
			else if(state.keyCode == 40) // down
			{
				$scope.selectWithDirection({x:0,y:1});
			}
			else if(state.keyCode == 37) // left
			{
				$scope.selectWithDirection({x:-1,y:0});
			}
			else if(state.keyCode == 39) // right
			{
				$scope.selectWithDirection({x:1,y:0});	
			}
		}

		event.stopPropagation();
	}

	$scope.updateLayout = function(layout)
	{	
		$scope.onUpdate();
		var layout = $scope.graph.makeLayout({name:'cose', animate:true});
		layout.run();
	}

	$scope.delete = function()
	{
		$scope.graph.$(":selected").remove();
		
		$scope.selected = {
			element:null,
			data: null
		}

		$scope.onUpdate();

	}

	

	$scope.selectWithDirection = function(dir) //방향에 따라 선택해준다.
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
			//console.log(selectedItem);
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
			selectedItem.unselect();
			found.ele.select();
		}
		//$scope.graph.nodes
	}

	$scope.editNode = function()
	{
		var data = $scope.graph.$(":selected").data();
		//console.log(selectedNode);

		$scope.modalInstance = $uibModal.open({
			size:"md",
			backdrop:true,
			templateUrl:"js/view/node-edit-modal-view.html",
			controller:"NodeEditModalCtrl",
			resolve:{
				item:function(){ return angular.copy(data); },
				title:function(){ return 'Edit'; }
			}
		});

		$scope.modalInstance.result.then(resultData=>{

			//Add Node
			console.log("edited");			
			$scope.graph.$(":selected").data(resultData);
			$scope.graph.forceRender();
			$scope.modalInstance = null;

		}, dismissed=>{
			console.log("dismissed");
			$scope.modalInstance = null;

		})
	}


	$scope.addNewNode = function()
	{

		var newNodeId = 'n'+moment().format('YYYYMMDDHHmmss');
		var newLinkId = 'l'+moment().format('YYYYMMDDHHmmss');
		
		var title = "";
		var parent = $scope.graph.$(":selected");
		if(parent.length == 0)
		{
			newNodeId = "root";
			title = "Input final goal";
		}
		else
		{
			title = "Input Sub goal for achiveing " + parent.data().name;
		}

		var parentPos = parent.position();
		var theta = Math.random() * Math.PI * 2;
		var r =100;
		var newPos = {x:parentPos.x+Math.cos(theta)*r, y:parentPos.y+Math.sin(theta)*r};

		$scope.modalInstance = $uibModal.open({
			size:"md",
			backdrop:true,
			templateUrl:"js/view/node-edit-modal-view.html",
			controller:"NodeEditModalCtrl",
			resolve:{				
				item:function(){ 					
					return {id:newNodeId, name:"", content:""}; 
				},
				title:function(){ return 'Add node : ' +  title; }
			}
		});

		$scope.modalInstance.result.then(resultData=>{
			
			var elements = [];
			resultData.size=10;
			var childNode = { group:'nodes', data: resultData, selectable:true, position:newPos };
			elements.push(childNode);

			if(parent.length > 0)
			{
				var parentData = parent.data();
				var edge = $scope.newEdge(resultData.id, parentData.id);
				elements.push(edge);
				$scope.graph.$(":selected").unselect();
			}

			//Add Node
			$scope.graph.add(elements);
			//$scope.graph.$(":visible").layout($scope.layoutState.list[$scope.layoutState.currentIndex]);
			$scope.graph.nodes("#"+newNodeId).select();
			$scope.onUpdate();
			$scope.modalInstance = null;

		}, dismissed=>{
			console.log("dismissed");
			$scope.modalInstance = null;

		})
	}

	$scope.removeEdge = function(sourceId, targetId)
	{
		var selector = "[target='"+targetId+"'][source='"+sourceId+"']";
		$scope.graph.edges(selector).remove();
		$scope.onUpdate();
	}

	$scope.newEdge = function(sourceId, targetId, index=0)
	{
		var newLinkId = 'l'+moment().format('YYYYMMDDHHmmss');
		if(index != 0)
			newLinkId += index;
		return { group:'edges', data: { id: newLinkId, source:sourceId, target:targetId }};
	}

	$scope.reloadDoc = function(objId)
	{
		var uid = $scope.firebaseUser.uid;
		var path  = "/user_data/"+uid+"/documents/"+objId;
		$scope.docRef = firebase.database().ref(path);
		$scope.docRef.once('value').then(function(snapshot){
			$scope.graph.elements().remove();
			$scope.currentDoc = snapshot.val();
			console.log($scope.currentDoc);
			$scope.graph.add($scope.currentDoc.graph_eles.map(e=>{
				if('size' in e.data == false)
					e.data.size = 40;
				return e;
			}));
			$scope.onUpdate();
			$scope.graph.$(":visible").layout($scope.layoutState.list[0]);
		});
	}

	$scope.loadDoc = function()
	{
		if(!$scope.firebaseUser)
		{
			alert("Please sign in first.");
			return;
		}
		$uibModal.open({
			size:"lg",
			controller:"DocumentLoadModalCtrl",
			templateUrl:"js/view/document-load-modal-view.html"
		}).result.then($scope.reloadDoc);
	}

	$scope.saveDoc = function()
	{
		if(!$scope.firebaseUser)
		{
			alert("Please sign in first.");
			return;
		}

		var rootNode = $scope.graph.$("#root");
		if(rootNode.length == 0)
		{
			alert("node is not exist");
			return;
		}

		var rootName = rootNode.data().name;
		var eles = $scope.graph.elements().jsons();

		$uibModal.open({
			size:"lg",
			controller:"DocumentSaveModalCtrl",
			templateUrl:"js/view/document-save-modal-view.html",
			resolve:{
				eles:function(){return eles;},
				rootName:function(){ return rootName;}
			}
		}).result.then($scope.reloadDoc);

	}

	$scope.editCode = function()
	{
		var original_eles = $scope.graph.elements().jsons();

		$uibModal.open({
			size:"lg",
			controller:"CodeEditModalCtrl",
			templateUrl:"js/view/code-edit-modal-view.html",
			resolve:{
				eles:function(){
					return angular.copy(original_eles);
				}
			}
		}).result.then(eles=>{
			try
			{
				$scope.graph.elements().remove();
				$scope.graph.add(eles);
				$scope.graph.$(":visible").layout($scope.layoutState.list[$scope.layoutState.currentIndex]);
			}
			catch(e)
			{
				alert("code have error!");
				$scope.graph.elements().remove();
				$scope.graph.add(original_eles);
				$scope.graph.$(":visible").layout($scope.layoutState.list[$scope.layoutState.currentIndex]);
			}
		});

	}

	
	$scope.auth.$onAuthStateChanged(function(firebaseUser)
	{
		if( !!firebaseUser )
		{	
			var justLogin = false;
			if($scope.firebaseUser == null)
				justLogin = true;
			$scope.firebaseUser = firebaseUser;
			var ref = firebase.database().ref();
			$scope.documents = $firebaseArray(ref.child('user_data').child($scope.firebaseUser.uid).child('documents'));
			//console.log("$onAuthStateChanged", firebaseUser, $scope.documents);
			if(justLogin)
				$scope.loadDoc();
		}
		else
		{
			$scope.firebaseUser = null;
			$scope.documents = null;			
			console.log("logout");
		}
	});

	$scope.changeOutput = function(selected)
	{
		$uibModal.open({
			size:"md",
			backdrop:true,
			templateUrl:"js/view/node-select-modal-view.html",
			controller:"NodeSelectModalCtrl",
			resolve:{
				title:function()
				{
					return "Edit output of "+selected.data.name;
				},
				nodes:function()
				{
					var targets = $scope.graph.edges("[source='"+selected.data.id+"']").map(e=>{return e.data().target;});
					return $scope.graph.nodes("[id!='"+selected.data.id+"']").map(ele=>{
						var data = ele.data();
						var nodeId = ele.data("id");
						data.selected = targets.indexOf(nodeId) != -1;
						return data;
					});
				}
			}
		}).result.then(nodes=>{
			$scope.graph.edges("[source='"+selected.data.id+"']").remove();
			var edges = nodes.map((node,idx)=>{
				return $scope.newEdge(selected.data.id, node.id, idx);
			})
			$scope.graph.add(edges);
			$scope.onUpdate();
		})
	}

	$scope.changeInput = function(selected)
	{
		$uibModal.open({
			size:"md",
			backdrop:true,
			templateUrl:"js/view/node-select-modal-view.html",
			controller:"NodeSelectModalCtrl",
			resolve:{
				title:function()
				{
					return "Edit input of "+selected.data.name;
				},
				nodes:function()
				{
					var sources = $scope.graph.edges("[target='"+selected.data.id+"']").map(e=>{return e.data().source;});
					return $scope.graph.nodes("[id!='"+selected.data.id+"']").map(ele=>{
						var data = ele.data();
						var nodeId = ele.data("id");
						data.selected = sources.indexOf(nodeId) != -1;
						return data;
					});
				}
			}
		}).result.then(nodes=>{
			$scope.graph.edges("[target='"+selected.data.id+"']").remove();
			var edges = nodes.map((node,idx)=>{
				return $scope.newEdge(node.id, selected.data.id, idx);
			})
			$scope.graph.add(edges);
			$scope.onUpdate();
		})
	}

	$scope.onUpdate = function() {

		// Update linked node info		
		if(!!$scope.selected && !!$scope.selected.data)
		{
			var nodeId = $scope.selected.data.id;
			var source_edges = $scope.graph.edges("[source='"+nodeId+"']");
			var target_edges = $scope.graph.edges("[target='"+nodeId+"']");

			var source_node_ids = source_edges.map(ele=>{return ele.data('target');}).map(id=>{ return "#"+id;}).join(",");
			var target_node_ids = target_edges.map(ele=>{return ele.data('source');}).map(id=>{ return "#"+id;}).join(",");

			if(!!source_node_ids)
				$scope.selected.outputs = $scope.graph.$(source_node_ids).map(ele=>{ return ele.data()});
			else
				$scope.selected.outputs = [];

			if(!!target_node_ids)
				$scope.selected.inputs = $scope.graph.$(target_node_ids).map(ele=>{ return ele.data()});
			else
				$scope.selected.inputs = [];
			
		}

		var maxDist = 0;

		$scope.graph.nodes().forEach(ele=>{
			var aStar = $scope.graph.elements().aStar({ root: "#"+ele.data("id"), goal: "#root" });
			maxDist = Math.max(aStar.distance, maxDist);
			ele.data("dist", aStar.distance);
		})

		$scope.graph.nodes().forEach(ele=>{

			var dist = ele.data("dist");
			var size = (1.3 - (dist / maxDist)) * 100;
			size = Math.max(size, 20);
			if(isNaN(dist) == false)
				ele.data("size", size);
			else
				ele.data("size", 10);
		})
	}

	$scope.$on('cy:node:select', function(event, data){

		//console.log("node selected!");
		$scope.selected.element = data.cyTarget;
		$scope.selected.data = angular.copy(data.cyTarget.data());
		$scope.onUpdate();		

		var phase = $scope.$root.$$phase;
		if(phase == '$apply' || phase == '$digest'){
			//do nothing
		}else{
			$scope.$apply();
		}

	})

	
	$scope.onTimer = function()
	{

		if(!!$scope.input.autoSave && !!$scope.docRef && !$scope.saving)
		{
			
			$scope.saving == true;

			var eles = angular.copy($scope.graph.elements().jsons()).map(e=>{
				if('$$hash' in e.data)
					delete e.data["$$hash"];
				if('size' in e.data)
					delete e.data["size"];
				if('dist' in e.data)
					delete e.data["dist"];
				return e;
			});
			//console.log(eles);

			var saveData  = { name:$scope.currentDoc.name, graph_eles:eles};
			if($scope.lastSavedDataHash != JSON.stringify(saveData))
			{
				$scope.docRef.set(saveData).then(e=>{
					console.log("saved!!");
					$scope.saving == false;
					$scope.lastSavedDataHash = JSON.stringify(saveData);
				}, f=>{
					console.log("saved failed", f);
					$scope.saving == false;
				})
			}
			else
			{
				console.log("not changed");
			}
		}

		$timeout($scope.onTimer, 2000);
	}

	$timeout($scope.onTimer, 2000);

});


var app = angular.module('app', ['ngCytoscape']);

app.controller('MainCtrl', function($scope, cytoData){

	cytoData.getGraph('core').then(function(graph){
	    $scope.graph = graph;
	});

	$scope.form = {
		title:"",
		content:""
	};

	var layouts = [
        {name:'grid', animate: true},
        {name:'circle', animate: true},
        {name:'cose', animate: true},
        {name:'concentric', animate: true},
        {name:'breadthfirst', animate: true},
        {name:'random', animate: true}
    ];


    $scope.cy = {
    	elements:[
    		{ group:'nodes',data: { id: 'node1', name: '1111' } },
	        { group:'nodes',data: { id: 'node2', name: '2222'} },
	        { group:'nodes',data: { id: 'node3', name: '33333' } },
	        { group:'edges',data: { id: 'link1', source:'node1', target:'node2' }},
	        { group:'edges',data: { id: 'link2', source:'node2', target:'node3' }}
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
		    }
	    ],
	    layout : {name:'cose'}
    };

    $scope.updateLayout = function(layout) {
		console.log(layout);
		$scope.cy.layout = layout;
	}

	/*
	$scope.data = {
		node:[ {label:"root"} ],
		edge:[]
	}

	$scope.input = {
		selected:$scope.data.node[0]
	}

	$scope.cy = {
		elements : [
			{ group:'nodes',data: { id: 'ngCyto', name: 'ngCytoscape', href: 'http://cytoscape.org' } },
            { group:'nodes',data: { id: 'cyto', name: 'Cytoscape.js', href: 'http://js.cytoscape.org' } },
            { group:'nodes',data: { id: 'ng', name: 'Angular.js', href: 'http://js.cytoscape.org' } },
            { group:'edges',data: { id: 'ngToNgCyto', source:'ngCyto', target:'ng' }},
            { group:'edges',data: { id: 'cytoToNgCyto', source:'ngCyto', target:'cyto' }}
		],
		layout : { name: 'cose', animate: true },

		style : [ // See http://js.cytoscape.org/#style for style formatting and options.
			{
		        selector: 'node',
		        style: {
		            'shape': 'ellipse',
		            'border-width': 0,
		            'content': 'data(label)'
		        }
			},
			{
			    selector: ".center-center-normal",
			    style: {
		          'background-color': 'blue',
			      "text-valign": "center",
			      "text-halign": "center",
			      "text-outline-color": "#FFF",
      			  "text-outline-width": 2
			    }
			},
			{
			    selector: ".center-center-selected",
			    style: {
			      'background-color': 'red',
			      "text-valign": "center",
			      "text-halign": "center",
			      "text-outline-color": "#FFF",
      			  "text-outline-width": 2
			    }
			}
		]
	};

	$scope.cy.graph_ready = function(evt){
  		console.log('graph ready to be interacted with: ', evt);
  		$scope.dataToGraph();
	}

	$scope.getSelectedIndex = function(){
		return $scope.data.node.findIndex(e=>{ return $scope.input.selected === e })
	}

	

	$scope.onClickAddChild = function(){

		
		var label = $scope.form.title;
		var newNode = {label:label};

		console.log("onAddClick", label);

		// Add new node
		$scope.data.node.push(newNode);
		
		// Make link with current selected node
		var selectedIdx = $scope.getSelectedIndex();
		var addedNodeIdx = $scope.data.node.length-1;
		$scope.data.edge.push({ target: 'n'+selectedIdx,   source: 'n'+addedNodeIdx });

		$scope.input.selected = newNode;

		$scope.dataToGraph();
	}

	$scope.dataToGraph = function() {

		var selectedIndex = $scope.getSelectedIndex();
		
		var elements = {};

		for( var nodeIndex=0; nodeIndex<$scope.data.node.length; nodeIndex++ )
		{
			elements['n'+nodeIndex] = { 
				"group":'nodes', 
				"data":$scope.data.node[nodeIndex], 
				
				"classes" : (nodeIndex == selectedIndex) ? 'center-center-selected' : 'center-center-normal'
			};
		}

		for( var edgeIndex=0; edgeIndex<$scope.data.edge.length; edgeIndex++ )
		{
			elements['e'+edgeIndex] = { 
				"group":'edges', "data":$scope.data.edge[edgeIndex]
			};
		}

		console.log(elements);

		$scope.cy.elements = elements;
		$scope.graph.center();
		//console.log($scope.graph);
		//$scope.graph.style().update();
	}

	$scope.moveToLeft = function( nodeId ) {}
	$scope.moveToRight = function( nodeId ) {}
	$scope.moveToUp = function( nodeId ) {}
	$scope.moveToDown = function( nodeId ) {}
	$scope.edit = function( nodeId ) {

	}
	*/

});


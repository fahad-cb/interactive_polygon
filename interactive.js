
var setInstanceManager = function(container,settings){
	var insMgr = this;
	console.log(container);
	insMgr.container = container;
	insMgr.container.Nodes = [];
	insMgr.container.nodeElments = [];
	insMgr.container.svg = "";
	insMgr.init();
	
}

setInstanceManager.prototype.init = function(){
	var insMgr = this;
		
	insMgr.initNodes();
	insMgr.initSvgDrag();
	insMgr.initNodesDrag();
	insMgr.addNode();
	insMgr.deleteNode();
	insMgr.storyTeller();
	insMgr.responsive();
	
}

setInstanceManager.prototype.initNodes = function(){
	var insMgr = this;

	insMgr.container.Nodes = [
		{
			id : 1,
			top : 322,
			left : 644,
			
		},
		{
			id : 2,
			top : 460,
			left : 648,
			
		},
		{
			id : 3,
			top : 461,
			left : 543,
		},
		{
			id : 4,
			top : 129,
			left : 539,
		},
		{
			id : 5,
			top : 128,
			left : 830,
		},
		{
			id : 6,
			top : 192,
			left : 830,
		},
		{
			id : 7,
			top : 192,
			left : 647,
		},
		{
			id : 8,
			top : 271,
			left : 644,
		},
		{
			id : 9,
			top : 269,
			left : 804,
		},
		{
			id : 10,
			top : 316,
			left : 792,
		},

	]

	insMgr.initSvg();
	insMgr.createNodes();
	insMgr.updatePolygonPoints();
	
}

setInstanceManager.prototype.createNodes = function(){
	
	var insMgr = this;
	var nodeElement = "";
	var nodeElementId  = "";

	for (var i = 0; i < insMgr.container.Nodes.length ; i++) {
		nodeElementId = i + 1; 
		nodeElement = document.createElement('span');
		nodeElement.id = 'node-'+nodeElementId;
		nodeElement.style.position = "absolute";
		nodeElement.style.height = '10px';
		nodeElement.style.width = '10px'; 
		nodeElement.style.top = insMgr.container.Nodes[i].top+'px';
		nodeElement.style.left = insMgr.container.Nodes[i].left+'px';
		nodeElement.style.borderRadius = '4px';
		nodeElement.style.background = '#c9c95d'; 
		nodeElement.setAttribute('data-y',insMgr.container.Nodes[i].top);
		nodeElement.setAttribute('data-x',insMgr.container.Nodes[i].left);
		
		insMgr.container.svgParent.appendChild(nodeElement);
		insMgr.container.nodeElments.push(nodeElement); 
	};
}


setInstanceManager.prototype.initSvg = function(){
	var insMgr = this;
	var bigPlayButton = document.getElementById('bigPlayButton');
	var svgManager = document.getElementById('svg_manager');
	svgManager.style.display = "block";
	svgManager.style.height = "1200";

	insMgr.container.svgParent = document.createElement('div');
	insMgr.container.svgParent.className = "cb-vjs-ins-mgr-parent";
	insMgr.container.svgParent.style.position = 'absolute';
	
	insMgr.container.appendChild(insMgr.container.svgParent);
	insMgr.container.svgParent.appendChild(svgManager);
	insMgr.container.svgManager = svgManager;
	insMgr.container.svgManager.setAttribute('height',insMgr.container.offsetTop);
	insMgr.container.svgManager.setAttribute('width',insMgr.container.offsetWidth);

}

setInstanceManager.prototype.updatePolygonPoints = function(){
		var insMgr = this;

		var points = "";
		var nodeElement = "";
		var nodeElementId = "";
		points = insMgr.getPoints();
		var percentagePoints = insMgr.translatePxToPerc();
		
		var polygon = document.getElementById('polygon_manager');
		polygon.style.fill = "rgb(255, 255, 255)";
		polygon.style.fillOpacity = "1";
		polygon.style.stroke = "#000";
		polygon.style.strokeWidth = "0";
		polygon.setAttribute('points',points);
		insMgr.storyTeller.innerHTML = percentagePoints;
	
}

setInstanceManager.prototype.getPoints = function(array){
	var insMgr = this;
	var points = [];
	for (var i = 0; i < insMgr.container.Nodes.length ; i++) {
			nodeElementId = insMgr.container.Nodes[i].id;
			nodeElementId = "node-"+nodeElementId;
			nodeElement = document.getElementById(nodeElementId)
			var X = nodeElement.getAttribute('data-x');
			var Y = nodeElement.getAttribute('data-y');
			points.push(X +' '+ Y);
		}
		if (array){
			return points;
		}
		points = points.join(",");
		return points;
}



setInstanceManager.prototype.customPlayerSettings = function(){
	var insMgr = this;
	var bigPlayButtonState = true;
	var openModalBox = false;
	var player = insMgr.container;
	var playerEl = insMgr.container;
	var bigPlayButton = insMgr.container.getChild('bigPlayButton').el_;

	var removeBigPlayButton = function(){
		if ( bigPlayButtonState == true ){
			bigPlayButton.remove();
			bigPlayButtonState = false;
		}
	}
	
	playerEl.addEventListener('click',removeBigPlayButton);
	//insMgr.coordinates.addEventListener('click',customBinding);
}


setInstanceManager.prototype.initSvgDrag = function(){

	var insMgr = this;
	var svg = insMgr.container.svgManager;
	console.log(svg);
	svg.addEventListener('mousedown',enableSvgDrag);
	svg.addEventListener('mouseup',disableSvgDrag);
	svg.addEventListener('mousemove',actionSvgDrag);

	var svgDrag = false;
	var clickTimePosX = "";
	var clickTimePosY = "";
	var oldLeft = "";
	var oldTop = "";
	var tempLeft = [];
	var tempTop = [];

	function enableSvgDrag(e){
		svgDrag = true;
		clickTimePosX = e.pageX;
		clickTimePosY = e.pageY;

		for (var i = 0; i < insMgr.container.Nodes.length ; i++) {
			tempLeft.push(insMgr.container.Nodes[i].left); 
			tempTop.push(insMgr.container.Nodes[i].top);
		}
	}

	function disableSvgDrag(e){
		svgDrag = false;
		tempLeft = [];
		tempTop = [];

	}

	function actionSvgDrag(e){
		if (svgDrag){
			var dragTimePosX = e.pageX;
			var dragTimePosY = e.pageY;
			
			xDiff = dragTimePosX - clickTimePosX;
			yDiff = dragTimePosY - clickTimePosY;
			upgradePolygonPoints(xDiff,yDiff);
			
		}
	}
	
	function upgradePolygonPoints(x,y){
		
		for (var i = 0; i < insMgr.container.Nodes.length ; i++) {
			nodeElementId = insMgr.container.Nodes[i].id;
			nodeElementId = "node-"+nodeElementId;
			var nodeElement = document.getElementById(nodeElementId);
			
			
			newLeft = tempLeft[i] + x;
			newTop =  tempTop[i] + y;
			
			nodeElement.style.left = newLeft+"px";
			nodeElement.style.top = newTop+"px";
			nodeElement.setAttribute('data-y',newTop);
			nodeElement.setAttribute('data-x',newLeft);

			insMgr.container.Nodes[i].top = newTop;
			insMgr.container.Nodes[i].left = newLeft;
		}
		insMgr.updatePolygonPoints();
	}
}

setInstanceManager.prototype.initNodesDrag = function(){
	var insMgr = this;

	var drag = false;
	var parent = insMgr.container;
	

	parent.addEventListener('mousedown',enableDrag);
	parent.addEventListener("mouseup", disableDrag);
	parent.addEventListener("mousemove", actionDrag);

	var beforeLeft = "";
	var extraLeft = "";
	var beforeTop = "";
	var extraTop = "";
	var currentNode = "";

	function enableDrag(e){
		
		target_id = e.target.id;
		node = target_id.split('-')[0];

		if (node == 'node' ){
			drag = true;
			currentNode = document.getElementById(target_id);

			Left = currentNode.style.left;
			Left = Left.replace('px',"");

			Top = currentNode.style.top;
			Top = Top.replace('px',"");

			X = e.pageX - parent.offsetLeft;
			Y = e.pageY - parent.offsetTop;
		
			extraLeft = X - Left;
			extraTop = Y - Top;
		}
	}

	function disableDrag(e){
		drag = false;
	}

	
	function actionDrag(e){
		
		if (drag == true){
			beforeLeft = currentNode.style.left;
			beforeLeft = beforeLeft.replace('px',"");

			beforeTop = currentNode.style.top;
			beforeTop = beforeTop.replace('px',"");

			
			X = e.pageX - parent.offsetLeft;
			Y = e.pageY - parent.offsetTop;
			
			Xpos = X - extraLeft;
			Ypos = Y - extraTop;
			
			currentNode.style.left = Xpos+'px';
			currentNode.style.top = Ypos+'px';

			updatePolygonNode(currentNode,Xpos,Ypos);	
		}
	}

	function updatePolygonNode(node,xpos,ypos){
		
		node.setAttribute('data-x',xpos);
		node.setAttribute('data-y',ypos);
		

		nodeObjectId = node.id.split('-')[1];
		for (var i = 0; i < insMgr.container.Nodes.length ; i++) {
			if (nodeObjectId == insMgr.container.Nodes[i].id){
				insMgr.container.Nodes[i].left = xpos;
				insMgr.container.Nodes[i].top = ypos;
			}
		}
		insMgr.updatePolygonPoints();
	}
	
}

setInstanceManager.prototype.addNode = function(){
	
	var insMgr = this;
	insMgr.container.addEventListener('dblclick',addNode);
	
	function addNode(e){

		var Nodes = insMgr.container.Nodes;
		var parent = insMgr.container;
		var target_id = e.target.id;
		node = target_id.split('-')[0];

		if (node != 'node'){
			var left = e.pageX - parent.offsetLeft;
			var top = e.pageY - parent.offsetTop;
			var largest = 0;

			for (i = 0; i < insMgr.container.Nodes.length; i++) {
			    if (insMgr.container.Nodes[i].id > largest) {
			        largest = insMgr.container.Nodes[i].id;
			        assignNodeId = largest + 1;
			    }
			}
		
			var node = {
				id : assignNodeId,
				top : top,
				left : left,
			}

			var newnodeElement = document.createElement('span');
			newnodeElement.id = 'node-'+assignNodeId;
			newnodeElement.style.position = "absolute";
				
			newnodeElement.style.borderRadius = '4px';	
			newnodeElement.style.height = '10px';
			newnodeElement.style.width = '10px'; 
			newnodeElement.style.top = top+'px';
			newnodeElement.style.left = left+'px';
			newnodeElement.style.background = '#c9c95d'; 
			newnodeElement.setAttribute('data-y',top);
			newnodeElement.setAttribute('data-x',left);
			parent.appendChild(newnodeElement);

			insMgr.container.Nodes.push(node);
			insMgr.updatePolygonPoints();
		}	
	}
	
}

setInstanceManager.prototype.deleteNode = function(){
	
	var insMgr = this;
	insMgr.container.addEventListener('dblclick',deleteNode);
	
	function deleteNode(e){
		
		var target_id = e.target.id;
		tempnode = target_id.split('-');
		node = tempnode[0]
		id = tempnode[1];
		var NewNodes = [];
		if (node == 'node' ){
			var targetNode = document.getElementById(target_id);
			targetNode.remove(); 
			for (var i = 0; i < insMgr.container.Nodes.length ; i++) {
				if (id != insMgr.container.Nodes[i].id){
					NewNodes.push(insMgr.container.Nodes[i]);
				}
			}
			insMgr.container.Nodes = NewNodes;
			insMgr.updatePolygonPoints();	
		}
	}

}

setInstanceManager.prototype.storyTeller = function(){

	var insMgr = this;
	var select = function(){
		this.select();
	}

	insMgr.storyTeller.label = document.createElement('span');
	insMgr.storyTeller.label.innerHTML = "testS";

	insMgr.storyTeller = document.createElement('input');
	insMgr.interactive = document.getElementById('interactive');
	insMgr.storyTeller.className = 'storyTeller';
	insMgr.storyTeller.style.display = "block";	
	insMgr.storyTeller.type = "text";	
	insMgr.storyTeller.addEventListener("click",select);
	//use translatePxToPerc () to get the percentage of polygon points
	insMgr.storyTeller.value = insMgr.getPoints();

	document.body.insertBefore(insMgr.storyTeller,insMgr.interactive);
	
}

setInstanceManager.prototype.responsive = function(){
	var insMgr = this;
	var test = function(){
		console.log("resized");
	}
	insMgr.container.addEventListener("resize",test);
}


setInstanceManager.prototype.getPercentage = function(current,total){
	return percentage = current / total *100;		
}



setInstanceManager.prototype.translatePxToPerc = function(){
	var insMgr = this;
	var ratio = 1.77777;
	var playerWidth = insMgr.container.offsetWidth;
	var playerHeight = playerWidth / ratio;
	
	var getCoord = function(pos,value){

		var xPos = value.split(" ")[0];
		var yPos = value.split(" ")[1];
		if (pos == 'x'){
			return xPos;
		}else{
			return yPos;
		}

	}

	var points = insMgr.getPoints(true);
	var ponitsPerc = [];
	for (var i = 0; i < points.length ; i++) {
		var xPos = getCoord('x',points[i]);
		var yPos = getCoord('y',points[i]);

		var percentageX = insMgr.getPercentage(xPos,playerWidth).toFixed(2);
		var percentageY = insMgr.getPercentage(yPos,playerHeight).toFixed(2)
		ponitsPerc.push(percentageX+" "+percentageY); 
		
	}
	return ponitsPerc;
}


function instanceManager(container,settings){
	var instance = new setInstanceManager(container,settings);
}









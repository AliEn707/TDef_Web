var size = 10
var gridSize = 600
var nodeSize = 0//gridSize/size
var mode = 0

var attribs = new Array(size*size)
	
function getClickXY(event) {
	var clickY = (event.layerX == undefined ? event.offsetX : event.layerX) + 1 //Please don't worry. We'll fix it later. Maybe...
	var clickX = (event.layerY == undefined ? event.offsetY : event.layerY) + 1
	var mapX = clickX/nodeSize, mapY = clickY/nodeSize
	var index = Math.floor(mapX)*size + Math.floor(mapY)
	if (mode == 0) {
		attribs[index].type = attribs[index].type == -1 ? 1 : --attribs[index].type 
	}
	else {
		attribs[index].buildable = (attribs[index].buildable + 1)&1
	}
	drawNode(index)
}

function f(obj) {
	if(obj.getAttribute("class") == "red111")
		obj.setAttribute("class", "white")	
	else
		obj.setAttribute("class", "red111")
}

window.onresize = setHeight

function setHeight(event) {
	var obj = document.getElementById("mainTable")
	obj.setAttribute("height", window.innerWidth*0.75)
	obj = document.getElementById("map")
	gridSize = window.innerWidth*0.75/1.41*0.99
	nodeSize = (gridSize-2)/size
	obj.setAttribute("width", gridSize)
	obj.setAttribute("height", gridSize)
	obj.width  = gridSize
    obj.height = gridSize
	drawMap()
}

function drawMap() {
	for (var i = 0; i <= size*size; i++)
		drawNode(i)
}

function init() {
	var map = document.getElementById('map')
	map.addEventListener('click', getClickXY, false)
	for (var i = 0; i <= size; i++) {
		for (var j = 0; j < size; j++) {
			attribs[i*size + j] = {
				type: 1, //1 - walk, 0 - see, -1 - nothing
				buildable: 0
			}
		}
	}
	
	var mapCanvas = document.getElementById("map"),
	ctx = mapCanvas.getContext('2d')
	setHeight(0)
}

function drawNode(index) {
	var y = Math.floor(index/size), x = index%size //awful
	var mapCanvas = document.getElementById("map"),
	ctx = mapCanvas.getContext('2d')
	if (attribs[index].type == -1)
		ctx.fillStyle = "red"
	if (attribs[index].type == 1)
		ctx.fillStyle = "#ffffff"	
	if (attribs[index].type == 0)
		ctx.fillStyle = "blue"		
	ctx.fillRect(x*nodeSize+1, y*nodeSize+1, nodeSize, nodeSize)
	if (attribs[index].buildable == 1) {
		ctx.fillStyle = "#00ff00"	
		ctx.fillRect(x*nodeSize + nodeSize/4+1, y*nodeSize + nodeSize/4+1, nodeSize/2, nodeSize/2)
	}
	ctx.strokeStyle = "#000000"
	ctx.strokeRect(x*nodeSize+1, y*nodeSize+1, nodeSize, nodeSize)
}

function changeMapSize(obj) {
	var temp = parseInt(obj.value)
	if (temp != NaN && temp > 0 && temp < 100)
		size = temp
	else
		alert("Enter correct number!")
	init()
}

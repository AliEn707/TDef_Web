/*
╔══════════════════════════════════════════════════════════════╗
║ Map editor                                          					  	 ║
║ 												║
║ created by Yaroslav Zotov	                        				            ║
║ sep 2014                                               						 ║
╚══════════════════════════════════════════════════════════════╝
*/
var size = 10
var gridSize = 600
var nodeSize = 0 //gridSize/size
var mode = 0 //mapEditor_brush mode
var currentIndex = 0 //used for show selected respawn in map
var numberOfWaves = 0
var numbersOfParts = new Array() //parts by each wave
var mousedownID = -1
var d_scale = 0, d_posX = 0, d_posY = 0

var scale=1/1.41
var translatex = 0
var translatey = gridSize/2

var attribs = new Array(size*size) //objects containing buildable and walkable params for each cell
var bases = new Array()
var respawns = new Array()
var selectedResps = new Array() //contains all selected resps

var editor = 'mapEdit' // current editor mode (map or texture edit)

function mapEditor_controlScreen(ds, dx, dy) {
	d_scale = ds
	d_posX = dx
	d_posY = dy
	mousedownID = setInterval(function () {scale += d_scale; translatex += d_posX; translatey += d_posY; mapEditor_setHeight()}, 100)
}

function mapEditor_getGridX(x,y){
var sx=scale
var sy=scale*0.5
var tx=translatex
var ty=translatey
	return -(500*y)/(707*sy)+(500*x)/(707*sx)+
			(500*sx*ty-500*sy*tx)/
			(707*sx*sy);
}

function mapEditor_getGridY(x,y){
var sx=scale
var sy=scale*0.5
var tx=translatex
var ty=translatey
return (500*y)/(707*sy)+(500*x)/(707*sx)-
			(500*sx*ty+500*sy*tx)/
			(707*sx*sy);
}

function mapEditor_gridToScreenX(x, y){
	return scale*(0.707*x*nodeSize + 0.707*y*nodeSize)+translatex
}

function mapEditor_gridToScreenY(x, y){
	return scale*0.5*(0.707*y*nodeSize - 0.707*x*nodeSize) + translatey
}

function mapEditor_setWalkData() { //write walk data to html
	var obj = document.getElementsByName("walkdata")
	var text = ""
	for (var i = 0; i < size*size; i++)
		text += attribs[i].walk < 0 ? '-' : attribs[i].walk
	obj[0].setAttribute("value", text)
}

function mapEditor_setBuildData() { //write buildable data to html
	var obj = document.getElementsByName("builddata")
	var text = ""
	for (var i = 0; i < size*size; i++)
		text += attribs[i].buildable < 0 ? '-' : attribs[i].buildable
	obj[0].setAttribute("value", text)
}

function mapEditor_findSelectedResps() { //fill selectedResps with selected respawn points
	selectedResps = new Array()
	for (var i in bases) {
		var obj = document.getElementById("b" + bases[i])
		if (obj != null) {
			var selectedIndex = obj.selectedIndex
			if (selectedIndex != -1 && obj.options[selectedIndex].value != -1)
				selectedResps.push(parseInt(obj.options[selectedIndex].value))
		}
	}
}

function mapEditor_respSelected(arg) { //on select resp point disable it in other lists (other bases and parts)
	mapEditor_findSelectedResps() //fill selectedResps with selected respawn points
	for (var j in bases) { //walk through all bases and disable/enable selected point
		var list = document.getElementById('b' + bases[j])
		var length = list.options.length
		for (var i = 1; i < length; i++) {
			if (selectedResps.indexOf(parseInt(list.options[i].value)) != -1 && list.selectedIndex != i) {
				if (arg.id != 'b' + bases[j])
					list.options[i].setAttribute("disabled", "disabled")
			}
			else 
				list.options[i].removeAttribute("disabled")
		}
	}
	for (var i = 1; i <= numberOfWaves; i++)
		for (var j = 1; j <= numbersOfParts[i]; j++) {
			var select = document.getElementsByName('wave'+ i + '[part' + j + '[]]')[0]
			var length = select.options.length
			for (var k = 1; k < length; k++)
				if (selectedResps.indexOf(parseInt(select.options[k].value)) != -1 && select.selectedIndex != k) 
					select.options[k].setAttribute("disabled", "disabled")
				else 
					select.options[k].removeAttribute("disabled")
		}		
}

function mapEditor_focusResp(arg) { //show current respawn point on the map
	mapEditor_unfocusResp(arg)
	currentIndex = arg.options[arg.selectedIndex].value
	if (currentIndex == -1)
		return
	var x = currentIndex%size, y = Math.floor(currentIndex/size)
	var mapCanvas = document.getElementById("map")
	var ctx = mapCanvas.getContext('2d')
	ctx.setTransform(0,0,0,0,0,0)
	ctx.setTransform( 1, 0, 0, 1, translatex, translatey)
	ctx.scale(scale,scale*0.5);
	ctx.rotate(-45*Math.PI/180)
	ctx.strokeStyle = "#ff7318"
	ctx.lineWidth = 5
	ctx.strokeRect(x*nodeSize + nodeSize*0.1 + 1, y*nodeSize + nodeSize*0.1 + 1, nodeSize*0.8, nodeSize*0.8)
	ctx.setTransform(0,0,0,0,0,0)
	ctx.setTransform( 1, 0, 0, 1, translatex, translatey)
	
}

function mapEditor_unfocusResp(arg) { //hide previous respawn point on the map
	var mapCanvas = document.getElementById("map")
	var ctx = mapCanvas.getContext('2d')
	mapEditor_drawMap()
}

function mapEditor_brush(clickX, clickY) {
	var mapX = clickX/nodeSize, mapY = clickY/nodeSize //coords in map
	var index = Math.floor(mapX)*size + Math.floor(mapY)
	if (editor == 'mapEdit') {
		if (!(clickX >= 0 && clickX < gridSize && clickY >= 0 && clickY < gridSize))
			return
		switch(mode) { //brush mode
			case 0: //draw walkable
				attribs[index].walk = attribs[index].walk == -1 ? 1 : --attribs[index].walk
				mapEditor_setWalkData()
				break
			case 1: //draw buildable
				attribs[index].buildable = (attribs[index].buildable + 1)&1
				mapEditor_setBuildData()
				break
			case 2: //draw base
				var pos = -1
				if ((pos = bases.indexOf(index)) == -1) {//no such element: create new base
					bases.push(index)
					var div = document.createElement('div')
					div.setAttribute("id", "base" + index)
					div.innerHTML = 'base' + index + ': '
					var list = document.createElement('select')
					list.setAttribute("name", "b" + index)
					list.setAttribute("id", "b" + index)
					list.setAttribute("onchange", "mapEditor_respSelected(this)")
					list.setAttribute("onmousemove", "mapEditor_focusResp(this)")
					list.setAttribute("onmouseout", "mapEditor_unfocusResp(this)")
					list.options[list.options.length] = new Option("none", -1)
					
					mapEditor_findSelectedResps()
					for (var i in respawns) { //added all respawn points into base's list
						list.options[list.options.length] = new Option("x: " + Math.floor(respawns[i]/size) + " y: " + respawns[i]%size, respawns[i])
						if (selectedResps.indexOf(respawns[i]) != -1)
							list.options[list.options.length - 1].setAttribute("disabled", "disabled")
					}
					div.appendChild(list)
					document.getElementById('basesDiv').appendChild(div)
				} else { //base exists: delete it
					bases.splice(pos, 1)
					var elem = document.getElementById('base' + index)
					elem.parentNode.removeChild(elem)
				}
				break
			case 3: //draw respawn
				var pos = -1
				if ((pos = respawns.indexOf(index)) == -1) { //no such element: create resp point
					respawns.push(index)
					for (var i in bases) { //addnew resp point to all bases' lists
						var obj = document.getElementById("b" + bases[i])
						obj.options[obj.options.length] = new Option("x: " + Math.floor(mapX) + " y: " + Math.floor(mapY), index)
					}
					for (var i = 1; i <= numberOfWaves; i++)
						for (var j = 1; j <= numbersOfParts[i]; j++) {
							var select = document.getElementsByName('wave'+ i + '[part' + j + '[]]')[0]
							select.options[select.options.length] = new Option("x: " + Math.floor(mapX) + " y: " + Math.floor(mapY), index)
						}
				} else { //delete resp point
					respawns.splice(pos, 1)	
					for (var i in bases) {
						var obj = document.getElementById("b" + bases[i])
						for (var j in obj.options) //delete resp point in all bases' lists
							if(obj.options[j].value == index) {
								obj.options.remove(j)
								break
							}
					}
					for (var i = 1; i <= numberOfWaves; i++)
						for (var k = 1; k <= numbersOfParts[i]; k++) {
							var select = document.getElementsByName('wave'+ i + '[part' + k + '[]]')[0]
							for (var j in select.options) //delete resp point in all waves' parts' lists
								if(select.options[j].value == index) {
									select.options.remove(j)
									break
								}
						}
				}
				break
		}
	} else { //textureEdit
		if (textureBrush != 0 && !(clickX >= 0 && clickX < gridSize && clickY >= 0 && clickY < gridSize))
			return	
		if (currentTexture == -1)
			return
		switch(textureBrush) {
			case 0: //tiles mode: draw texture on tiles'
				if (!(clickX >= 0 && clickX < gridSize && clickY >= 0 && clickY < gridSize)) {
					var r, s, iOut = 0
					if (mapX < 0 && mapY > 0) {
						r = Math.floor(-mapX)
						s = Math.floor(mapY)
						iOut = 0
					}
					if (mapX > 0 && mapY > size && mapX < size) {
						r = Math.floor(mapY - size)
						s = Math.floor(mapX)
						iOut = 1
					}
					if (mapX > size && mapY > 0 && mapY < size) {
						r = Math.floor(mapX - size)
						s = Math.floor(mapY)
						iOut = 2
					}
					if (mapX > 0 && mapY < 0) {
						r = Math.floor(-mapY)
						s = Math.floor(mapX)
						iOut = 3
					}
					if (!(s >= r && s < size - r))
						return
					index = r*(size - (r - 1)) + s - r
					outerNodesTextures[iOut][index] = currentTexture
					break
				}
				nodesTextures[index] = currentTexture
				break
			case 1: //walls
				mapEditor_changeWall(index)
				break
			case 2:
				var flag = 0
				for (var i = 0; i < objects.length; i++)
					if (objects[i].ind == index) {
						if (objects[i].texture != currentTexture) //change texture
							objects[i].texture = currentTexture
						else //remove
							objects.splice(i, 1)
						flag = 1
						break
					}
				if (!flag)
					objects.push({ind: index, texture: currentTexture})
				break
		}
	}
	mapEditor_drawMap() //mapEditor_drawNode(index)
}
	
function mapEditor_getClickXY(event) { //handle mouse click: get it's position on map
	var clickY = 0
	var clickX = 0
	if (event.layerX || event.layerX == 0) { //Firefox
		clickY = event.layerX + 1
		clickX = event.layerY + 1
	} else if (event.offsetX || event.offsetX == 0) { //Opera
		clickY = event.offsetX + 1
		clickX = event.offsetY + 1
	}
	if (navigator.userAgent.search(/Chrome/) > 0) { //Chrome
		clickY = event.offsetX + 1
		clickX = event.offsetY + 1	
	}
	var y=clickX
	var x=clickY
	clickY=mapEditor_getGridX(x,y)
	clickX=mapEditor_getGridY(x,y)
	mapEditor_brush(clickX, clickY)
}

window.onresize = mapEditor_setHeight

function mapEditor_setHeight(event) { //change some sizes when window size changes
	var obj = document.getElementById("mainTable")
	obj.setAttribute("height", window.innerHeight*0.98)
	obj = document.getElementById("map")
	gridSize = window.innerWidth*0.75/1.41*0.99
	nodeSize = (gridSize-2)/size
	obj.setAttribute("width", document.getElementById('canvasTd').offsetWidth)
	obj.setAttribute("height", document.getElementById('canvasTd').offsetHeight)
	mapEditor_drawMap()
}

function mapEditor_drawMap() {
	var ctx = document.getElementById('map').getContext('2d')
	ctx.canvas.width = ctx.canvas.width //Awesome!
	for (var i = 0; i < size*size; i++)
		mapEditor_drawNode(i)
	if (editor == 'textureEdit') {
		var k = 0, i, j
		for(i=-1;i>-(size/2+size%2+1);i--)
			for(j=-i-1;j<size-(-i-1);j++) {
				mapEditor_drawOuterNode(i, j, outerNodesTextures[3][k])
				k++;
			}
		k=0;
		for(j=0;j<(size/2+size%2+1);j++)
			for(i=j;i<size-j;i++) {
				mapEditor_drawOuterNode(i, size + j, outerNodesTextures[2][k])
				k++;
			}
		k=0;
		for(i=0;i<(size/2+size%2+1);i++)
			for(j=i;j<size-i;j++) {
				mapEditor_drawOuterNode(size + i, j, outerNodesTextures[1][k])
				k++;
			}
		k=0;
		for(j=-1;j>-(size/2+size%2+1);j--)
			for(i=-j-1;i<size-(-j-1);i++) {
				mapEditor_drawOuterNode(i, j, outerNodesTextures[0][k])
				k++;
			}
		for (var i in walls) {
			var x = walls[i].index%size, y = Math.floor(walls[i].index/size)
			ctx.setTransform(scale, 0, 0, scale*0.5, translatex, translatey)
			ctx.rotate(-45*Math.PI/180)
			ctx.translate((x + 0.5)*nodeSize,(y + 0.5)*nodeSize)
			if (walls[i].direction == 'y') {
				ctx.rotate(180*Math.PI/180)
				ctx.transform(1, 0, 1, -1, -1.015*nodeSize, 0.5*nodeSize)
				ctx.drawImage(images[walls[i].texture], 1, 1 - nodeSize*0.8, nodeSize*1.31, nodeSize*1.31)
			} else {
				ctx.rotate(-270*Math.PI/180)
				ctx.transform(1, 0, 1, 1, -1.015*nodeSize, -0.5*nodeSize)
				ctx.drawImage(images[walls[i].texture], 1, 1 - nodeSize*0.8, nodeSize*1.31, nodeSize*1.31)				
			}
			ctx.setTransform(1, 0, 0, 1, 0, 0)
		}
		for (var i in objects) {
			var x = objects[i].ind%size, y = Math.floor(objects[i].ind/size)
			var screenX = mapEditor_gridToScreenX(x, y), screenY = mapEditor_gridToScreenY(x, y)
			ctx.setTransform(scale, 0, 0, scale, 0, 0)
			ctx.drawImage(images[objects[i].texture], screenX/scale, screenY/scale - nodeSize*1.41, nodeSize*1.41, nodeSize*1.41)
		}
		ctx.setTransform(1, 0, 0, 1, 0, 0)
	}
}

function mapEditor_showMouseCoords(event) {
	var clickY = 0
	var clickX = 0
	if (event.layerX || event.layerX == 0) { //Firefox
		clickY = event.layerX + 1
		clickX = event.layerY + 1
	} else if (event.offsetX || event.offsetX == 0) { //Opera
		clickY = event.offsetX + 1
		clickX = event.offsetY + 1
	}
	if (navigator.userAgent.search(/Chrome/) > 0) { //Chrome
		clickY = event.offsetX + 1
		clickX = event.offsetY + 1	
	}
	var y=clickX
	var x=clickY
	clickY=mapEditor_getGridX(x,y)
	clickX=mapEditor_getGridY(x,y)
	var mapX = clickX/nodeSize, mapY = clickY/nodeSize, index = Math.floor(mapX)*size + Math.floor(mapY)
	if (mapX >= 0 && mapX < size && mapY >= 0 && mapY < size)
		document.getElementById('mouseInfo').innerHTML = 'x = ' + Math.floor(mapX) + ' y = ' + Math.floor(mapY) + ' index = ' + index
}

function mapEditor_init() { //init data
	numberOfWaves = 0
	var map = document.getElementById('map')
	map.addEventListener('click', mapEditor_getClickXY, false)
	map.addEventListener('mousemove', mapEditor_showMouseCoords, false)
	nodesTextures = new Array (size*size)
	var outerSize = (1+(size+1)%2+size)/2*(size/2+size%2)
	for (var i = 0; i < 4; i++) {
		outerNodesTextures[i] = new Array(outerSize)
		for (var j = 0; j < outerSize; j++)
			outerNodesTextures[i][j] = 1
	}
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			attribs[i*size + j] = {
				walk: 1, //1 - walk, 0 - see, -1 - nothing
				buildable: 0
			}
			nodesTextures[i*size + j] = 0
		}
	}
	currentIndex = 0
	ctx = map.getContext('2d')
	mapEditor_setHeight(0)
	mapEditor_setWalkData()
	mapEditor_setBuildData()
	mapEditor_brushChange(document.getElementById('mode'))
	bases = new Array()
	respawns = new Array()
	selectedResps = new Array() 	
	document.getElementById("wavesDiv").innerHTML = ""
	document.getElementById("basesDiv").innerHTML = "Base: respawn<br>"
	if (document.getElementById('pc_base').checked) {
		document.getElementById('pc_base').checked = false
		mapEditor_togglePCbase(document.getElementById('pc_base'))
	}
	mapEditor_drawMap()
	mapEditor_textureBrushChange(document.getElementById('textureBrush'))
	for (var i = 0; i < textures.length; i++) {
		images[i] = new Image()
		images[i].src = previews[i]
	}
	walls.length = 0
	objects.length = 0
	obj=document.getElementById('initButton')
	obj.parentNode.removeChild(obj)
}

function mapEditor_drawNode(index) { 
	var y = Math.floor(index/size), x = index%size //awful
	var mapCanvas = document.getElementById("map"),
	ctx = mapCanvas.getContext('2d')
	ctx.setTransform(0,0,0,0,0,0)
	ctx.setTransform( 1, 0, 0, 1, translatex, translatey)
	ctx.scale(scale,scale*0.5);
	ctx.rotate(-45*Math.PI/180)
	ctx.lineWidth = 1
	if (editor == 'textureEdit') {
		ctx.globalAlpha = 1
		if (nodesTextures[index] != -1) 
			ctx.drawImage(images[nodesTextures[index]], x*nodeSize+1, y*nodeSize+1, nodeSize, nodeSize);
	}
	if (editor == 'mapEdit' || (editor == 'textureEdit' && document.getElementById('opacity').checked)) { //awesome
		if (editor == 'textureEdit' && document.getElementById('opacity').checked)
			ctx.globalAlpha = 0.5	
		//draw walk type:
		if (attribs[index].walk == -1) 
			ctx.fillStyle = "red"
		if (attribs[index].walk == 1)
			ctx.fillStyle = "#ffffff"	
		if (attribs[index].walk == 0)
			ctx.fillStyle = "blue"		
		ctx.fillRect(x*nodeSize+1, y*nodeSize+1, nodeSize, nodeSize)
		if (attribs[index].buildable == 1) { //draw build type
			ctx.fillStyle = "#00ff00"	
			ctx.fillRect(x*nodeSize + nodeSize/4+1, y*nodeSize + nodeSize/4+1, nodeSize/2, nodeSize/2)
		}
		if (bases.indexOf(index) != -1) { //draw base
			ctx.fillStyle = "brown"
			ctx.beginPath()
			ctx.arc(x*nodeSize + nodeSize/2+1, y*nodeSize + nodeSize/2+1, nodeSize/5, 0, Math.PI*2, true)
			ctx.fill()
		}
		if (respawns.indexOf(index) != -1) { //draw respawn point
			ctx.strokeStyle = "cyan"
			ctx.beginPath()
			ctx.arc(x*nodeSize + nodeSize/2+1, y*nodeSize + nodeSize/2+1, nodeSize*0.375, 0, Math.PI*2, true)
			ctx.stroke()
			ctx.beginPath()
			ctx.arc(x*nodeSize + nodeSize/2+1, y*nodeSize + nodeSize/2+1, nodeSize/4, 0, Math.PI*2, true)
			ctx.stroke()
		}
	}
	ctx.strokeStyle = "#000000"
	ctx.strokeRect(x*nodeSize+1, y*nodeSize+1, nodeSize, nodeSize) //draw frame
	ctx.setTransform(0,0,0,0,0,0)
	ctx.setTransform( 1, 0, 0, 1, 0, 0 )
}

function mapEditor_drawOuterNode(x, y, textureIndex) {
	ctx.setTransform(0,0,0,0,0,0)
	ctx.setTransform( 1, 0, 0, 1, translatex, translatey)
	ctx.scale(scale,scale*0.5);
	ctx.rotate(-45*Math.PI/180)
	ctx.lineWidth = 1	
	ctx.drawImage(images[textureIndex], x*nodeSize+1, y*nodeSize+1, nodeSize, nodeSize)
	ctx.strokeStyle = "#000000"
	ctx.strokeRect(x*nodeSize+1, y*nodeSize+1, nodeSize, nodeSize) //draw frame
	ctx.setTransform(0,0,0,0,0,0)
	ctx.setTransform( 1, 0, 0, 1, 0, 0 )
}

function mapEditor_changeMapSize(obj) {
	var temp = parseInt(obj.value)
	if (temp != NaN && temp > 2 && temp < 100) {
		size = temp
		document.getElementsByName('mapsize')[0].value = temp
	} else
		alert("Enter correct number!")
	mapEditor_init()
}

function mapEditor_recalcNumberOfParts(partnum, wavenum) { //when we delete a part we must shift indexes of other parts 
	for (var i = 2; i <= numbersOfParts[wavenum]; i++) {
		var inputs = document.getElementsByName('wave' + wavenum + '[part' + i + '[]]') //get all elements of current part
		if (inputs[0] != null) {
			if (document.getElementsByName('wave' + wavenum + '[part' + (i - 1) + '[]]')[0] == null) { //if there is no previous part
				inputs[0].parentNode.getElementsByTagName('span')[0].innerHTML = (i - 1) //we change displayed index of part	
				var length = inputs.length
				for (var j = 0; j < length; j++) //it works only like this
					inputs[0].setAttribute('name','wave'+wavenum+ '[part' + (i - 1) + '[]]')
			}
		}
	}
	numbersOfParts[wavenum]--	
}

function mapEditor_deletePart(obj) { 
	var partnum = parseInt(obj.parentNode.getElementsByTagName('span')[0].innerHTML) 
	var wavenum = parseInt(obj.parentNode.parentNode.getElementsByTagName('span')[0].innerHTML) //awesome
	if (numbersOfParts[wavenum] == 1)
		mapEditor_deleteWave(obj.parentNode)
	else {
		obj.parentNode.parentNode.removeChild(obj.parentNode)
		mapEditor_recalcNumberOfParts(partnum, wavenum)
	}
}

function mapEditor_addPart(obj) {
	var num = parseInt(obj.parentNode.getElementsByTagName('span')[0].innerHTML) //get current wave number
	numbersOfParts[num]++
	var div = document.createElement('div')
	div.innerHTML = 'Part'
	var span = document.createElement('span')
	span.innerHTML = numbersOfParts[num]
	div.appendChild(span)
	obj.parentNode.appendChild(div)
	var select = document.createElement('select')
	select.setAttribute('name', 'wave'+num + '[part' + numbersOfParts[num] + '[]]')
	select.options[select.options.length] = new Option("none", -1)
	select.setAttribute("onmousemove", "mapEditor_focusResp(this)")
	select.setAttribute("onmouseout", "mapEditor_unfocusResp(this)")
	for (var i in respawns) { //add all respawn points into list
		select.options[select.options.length] = new Option("x: " + Math.floor(respawns[i]/size) + " y: " + respawns[i]%size, respawns[i])
		if (selectedResps.indexOf(respawns[i]) != -1)
			select.options[select.options.length - 1].setAttribute("disabled", "disabled")
	}
	div.appendChild(select)
	var inputs = new Array(3)
	for (var i = 0; i < 3; i++) { //create 
		inputs[i] = document.createElement('input')
		inputs[i].setAttribute('type', 'value')
		inputs[i].setAttribute('name','wave'+num+ '[part' + numbersOfParts[num]+'[]]')
		inputs[i].setAttribute('size','3')
		inputs[i].setAttribute('value',i==0?"npcid":i==1?'num':'delay')
		div.appendChild(inputs[i])
	}
	var input=document.createElement('input')
	input.setAttribute('type', 'button')
	input.setAttribute('value', 'Delete')
	input.setAttribute('onclick', 'mapEditor_deletePart(this)')
	div.appendChild(input)
}

function mapEditor_addWave() {
	numberOfWaves++
	numbersOfParts[numberOfWaves] = 0
	var div = document.createElement('div')
	div.innerHTML = 'Wave'
	
	var span = document.createElement('span')
	span.setAttribute('id', 'span' + numberOfWaves)
	span.innerHTML = numberOfWaves
	
	var buttonAdd = document.createElement('input')
	buttonAdd.setAttribute('type', 'button')
	buttonAdd.setAttribute('value', 'Add part')
	buttonAdd.setAttribute('onclick', 'mapEditor_addPart(this)')
	
	var buttonDel = document.createElement('input')
	buttonDel.setAttribute('type', 'button')
	buttonDel.setAttribute('value', 'Del wave')
	buttonDel.setAttribute('onclick', 'mapEditor_deleteWave(this)')
	
	var delay = document.createElement('input')
	delay.setAttribute('type', 'text')
	delay.setAttribute('value', 'delay')
	delay.setAttribute('size', 5)
	delay.setAttribute('name', 'wave' + numberOfWaves + '[delay]')
	
	div.appendChild(span)
	div.appendChild(delay)
	div.appendChild(buttonAdd)	
	div.appendChild(buttonDel)
	mapEditor_addPart(div.getElementsByTagName('input')[0]) //each wave must contain at least one part
	document.getElementById('wavesDiv').appendChild(div)
}

function mapEditor_recalcNumberOfWaves() { //when we delete a wave we must shift indexes of other waves 
	for (var i = 2; i <= numberOfWaves; i++) {
		var span = document.getElementById("span" + i) //get an element from current wave
		if (span != null) {
			if (document.getElementById("span" + (i - 1)) == null) { //if previous wave doesn't exist
				for (var k = 1; k <= numbersOfParts[i]; k++) { //we change a lot of names (of parts and their subelements)
					var inputs = document.getElementsByName('wave' + i + '[part' + k + '[]]')
					if (inputs[0] != null) {
						var length = inputs.length
						for (var j = 0; j < length; j++)
							inputs[0].setAttribute('name', 'wave'+ (i - 1) + '[part' + k + '[]]')
					}
				}
				span.innerHTML = (i - 1) //new wave index
				span.setAttribute('id', 'span' + (i - 1))
				var delay = document.getElementsByName('wave' + i + '[delay]')[0]
				delay.setAttribute('name', 'wave'+ (i - 1) + '[delay]')
				numbersOfParts[i - 1] = numbersOfParts[i]
			}
		}
	}
	numberOfWaves--
}

function mapEditor_deleteWave(elem) {
	elem.parentNode.parentNode.removeChild(elem.parentNode)
	mapEditor_recalcNumberOfWaves()
}

function mapEditor_togglePCbase(obj) {
	if (obj.checked) {
		var select = document.createElement('select')
		select.setAttribute('name', 'pcbase[]')
		for (var i = 0; i < bases.length; i++)
			select.options[select.options.length] = new Option("x: " + Math.floor(bases[i]/size) + " y: " + bases[i]%size, bases[i])
		var input = document.createElement('input')
		input.setAttribute('type', 'text')
		input.setAttribute('size', 6)
		input.setAttribute('value', 'Health')
		input.setAttribute('name', 'pcbase[]')
		obj.parentNode.appendChild(select)
		obj.parentNode.appendChild(input)		
	} else {
		obj.parentNode.removeChild(obj.parentNode.getElementsByTagName('select')[0])
		obj.parentNode.removeChild(obj.parentNode.getElementsByTagName('input')[1])
	}
}

function mapEditor_brushChange(obj) {
	mode = document.getElementById('mode').selectedIndex
	var legend = document.getElementById('legend')
	if (mode == 0) {
		legend.style.visibility = 'visible' 
		legend.parentNode.style.height = legend.clientHeight + 'px'
	} else {
		legend.style.visibility = 'hidden'
		legend.parentNode.style.height = "0px"
	}
}

function mapEditor_completeMapInfo() {
	var text = ""
	text += size + "\n"
	text += document.getElementsByName("walkdata")[0].value + "\n"
	text += document.getElementsByName("builddata")[0].value + '\n'
	text += 'max_npcs ' + document.getElementsByName("max_npcs")[0].value + '\n'
	text += 'max_towers ' + document.getElementsByName("max_towers")[0].value + '\n'
	text += 'max_bullets ' + document.getElementsByName("max_bullets")[0].value + '\n'
	text += 'bases ' + bases.length + '\n'
	for (var i = 0; i < bases.length; i++)
		text += i + ' ' + bases[i] + ' ' + (document.getElementById('b' + bases[i]).selectedIndex - 1) + ' \n'
	var els = document.getElementsByName("pcbase[]")
	if (els[0] != null)
		text += 'pc_base ' + els[0].selectedIndex + ' ' + els[1].value + '\n'
	text += 'points ' + respawns.length + '\n'
	for (var i = 0; i < respawns.length; i++)
		text += i + ' ' + respawns[i] + '\n'
	text += 'waves ' + numberOfWaves + '\n'
	for (var i = 1; i <= numberOfWaves; i++) {
		text += 'parts ' + numbersOfParts[i] + ' ' + document.getElementsByName('wave' + i + '[delay]')[0].value + '\n'
		for (var j = 1; j <= numbersOfParts[i]; j++) {
			var params = document.getElementsByName('wave'+ i+ '[part' + j +'[]]')
			text += (params[0].selectedIndex - 1) + ' ' + params[1].value + ' ' + params[2].value + ' ' + params[3].value + '\n'
		}
	}
	document.getElementById('completeInfo').innerHTML = text
}

function mapEditor_loadBasesResps(text, i, str, brushMode) {
	if (text[i].search(str) != -1) {
		var length = parseInt(text[i].split(' ')[1])
		mode = brushMode //mapEditor_brush mode
		for (var j = 1; j <= length; j++) {
			var temp = text[++i].split(' ')
			var index = parseInt(temp[1])
			var clickX = Math.floor(index/size)*nodeSize, clickY = index%size*nodeSize
			mapEditor_brush(clickX, clickY)
			if (mode == 2) {
				document.getElementById('b' + index).selectedIndex = parseInt(temp[2]) + 1
			}
		}
	}
	return i
}

function mapEditor_setParams(obj, text, partsIndex, index) {
	var params = text[partsIndex].split(' ')
	obj.childNodes[index].childNodes[2].selectedIndex = parseInt(params[0]) + 1
	obj.childNodes[index].childNodes[3].value = params[1]
	obj.childNodes[index].childNodes[4].value = params[2]
	obj.childNodes[index].childNodes[5].value = params[3]
}

function mapEditor_loadMap() {
	var text = document.getElementById('loadMap').value.split('\n')
	if (text.length <= 1)
		return
	document.getElementById('mapSize').value = size = parseInt(text[0])
	mapEditor_init()
	for (var i = 0; i < size*size; i++) {
		attribs[i].walk = text[1][i] == '-' ? -1 : parseInt(text[1][i])
		attribs[i].buildable = parseInt(text[2][i])
	}
	mapEditor_setWalkData()
	mapEditor_setBuildData()
	var basesIndex = 0, partsIndex = 0, currentWave = 0, pcBase = 0
	for (var i = 2; i < text.length; i++) {
		if (text[i].match(/^max_[\S]+\s+\d+/g) != null) {
			var temp = text[i].split(' ')
			document.getElementsByName(temp[0])[0].value = temp[1]
			continue
		}
		if (text[i].search("pc_base") != -1) {
			pcBase = i
		}
		if (text[i].search('bases') != -1) {
			basesIndex = i
			i += parseInt(text[i].split(' ')[1])
			continue
		}
		i = mapEditor_loadBasesResps(text, i, "points", 3)
		if (text[i].search("waves") != -1) {
			var length = parseInt(text[i].split(' ')[1]) //number of waves
			for (var j = 1; j <= length; j++)
				mapEditor_addWave()	
			continue
		}
		if (partsIndex == 0 && text[i].search("parts") != -1) {
			partsIndex = i
			i += parseInt(text[i].split(' ')[1])
			continue		
		}
	}
	mapEditor_loadBasesResps(text, basesIndex, "bases", 2)
	while (partsIndex < text.length && text[partsIndex].search("parts") != -1) {
		var tmp = text[partsIndex].split(' ')
		var length = parseInt(tmp[1]) //number of parts
		var obj = document.getElementById('wavesDiv').childNodes[currentWave++]
		obj.childNodes[2].value = tmp[2] //set wave delay
		partsIndex++
		mapEditor_setParams(obj, text, partsIndex, 5)
		for (var j = 1; j < length; j++) {
			mapEditor_addPart(obj.childNodes[3])
			mapEditor_setParams(obj, text, partsIndex + j, 5 + j)
		}
		partsIndex += length
	}
	if (pcBase != 0) {
		var params = text[pcBase].split(' ')
		document.getElementById('pc_base').checked = true
		mapEditor_togglePCbase(document.getElementById('pc_base'))
		document.getElementById('pcbase').childNodes[3].selectedIndex = parseInt(params[1])
		document.getElementById('pcbase').childNodes[4].value = params[2]
	}
	mapEditor_drawMap()
	mode = document.getElementById('mode').selectedIndex
}

function mapEditor_selectEditor(type) {
	if (type == 'mapEdit') {
		document.getElementById('mapEdit').style.display = 'block'
		document.getElementById('textureEdit').style.display = 'none'
	} else {
		document.getElementById('mapEdit').style.display = 'none'
		document.getElementById('textureEdit').style.display = 'block'	
	}
	editor = type
	mapEditor_drawMap()
}

function mapEditor_handleKey(event) {
	if (event.keyCode == 27) //Escape pressed
		document.getElementById('popup').style.display = 'none'
}

/*///////////////////////////////////////////
Textures
///////////////////////////////////////////*/

var images = [] //contain textures images
var currentTexture = -1
var textureBrush = 0
var nodesTextures = []
var outerNodesTextures = [[],[],[],[]]
var walls = []
var objects = []

function mapEditor_setTexture(num) {
	currentTexture = num
	document.getElementById('currentTexture').src = previews[num]
	document.getElementById('popup').style.display = 'none'
}

function mapEditor_showHideChilds(obj) {
	var length = obj.parentNode.childNodes.length, array = obj.parentNode.childNodes
	for (var i = 1; i < length; i++)
		if (array[i].style.display == 'none')
			array[i].style.display = 'inline-block'
		else
			array[i].style.display = 'none'
}

function mapEditor_selectTexture() {
	var popup = document.getElementById('popup')
	popup.style.height = window.innerHeight*0.5 +'px'
	popup.style.width = window.innerWidth*0.5 +'px'
	popup.style.top = window.innerHeight*0.25 +'px'
	popup.style.left = window.innerWidth*0.25 +'px'
	for (var i = 0; i < textures.length; i++) {
		var t = textures[i]
		if (! /^[^/]*$/g.test(t)) { //if not a name
			var dirs = t.split('/'), parent = popup
			t = dirs[dirs.length - 1] //name
			dirs.splice(-1, 1)
			var path = ''
			for (var j = 0; j < dirs.length; j++) {
				path += dirs[j]
				if (document.getElementById(path + '_folder') == null)	{ //create new element - folder
					var div = document.createElement('div')
					div.setAttribute("id", path + '_folder')
					div.innerHTML = '<span onclick = "mapEditor_showHideChilds(this)"><h2>' + (dirs[j] == '' ? '/' : dirs[j]) + '</h2></span>'
					div.style.position = 'relative'
					div.style.left = '15px'
					div.style.width = (window.innerWidth*0.5 - (j + 2)*15) + 'px'
					div.style.borderBottom = 'dashed 1px'
					div.style.display = 'none'
					parent.appendChild(div)
				}	
				parent = document.getElementById(path + '_folder')
			}
		}
		if (document.getElementById('tex' + i) == null)	{
			var elm = document.createElement('img')
			elm.setAttribute("id", 'tex' + i)
			elm.setAttribute("height", '64')
			elm.setAttribute("width", '64')
			elm.setAttribute("src", previews[i])
			elm.setAttribute("onclick", 'mapEditor_setTexture(' + i + ')')
			elm.setAttribute("class","img-polaroid")
			elm.style.position = 'relative'
			elm.style.border = 'solid 1px'
			elm.style.display = 'none'
			parent.appendChild(elm)
		}
	}
	document.getElementById('_folder').style.display = 'inline-block'
	if (document.getElementById('closeButton') == null)
		popup.innerHTML += '<div id = "closeButton" style = "position: absolute; top:5px; right:5px"><input type = "button" value = "close" onclick = "popup.style.display=\'none\'"></div>'
	popup.style.display = 'block'
}

function mapEditor_textureBrushChange() {
	textureBrush = document.getElementById('textureBrush').selectedIndex
	if (textureBrush == 1)
		document.getElementById('wallsDirection').style.display = 'block'
	else
		document.getElementById('wallsDirection').style.display = 'none'
}

function mapEditor_getWallIndex(index, dir) {
	for (var i = 0; i < walls.length; i++)
		if (walls[i].index == index && walls[i].direction == dir)
			return i
	return -1
}

function mapEditor_changeWall(index_) {
	if (currentTexture == -1)
		return
	var elements = document.getElementsByName('direction')
	if (elements[2].checked) {//delete
		var i1 = mapEditor_getWallIndex(index_, 'x')
		var i2 = mapEditor_getWallIndex(index_, 'y')
		if (i2 != -1)
			walls.splice(i2, 1)
		if (i1 != -1)
			walls.splice(i1, 1)			
		return
	}
	var dir = elements[0].checked ? 'x' : 'y'
	var ind = mapEditor_getWallIndex(index_, dir)
	if (ind == -1) //create new wall
		walls.push({index: index_, direction: dir, texture: currentTexture})
	else { //change wall parameters
		walls[ind].texture = currentTexture
		walls[ind].direction = dir
	}		
}

function mapEditor_saveTextures() {
	var text = ""
	for (var i = 0; i < textures.length; i++) {
		tex = textures[i].replace(/^[/].*?\/|\..*?$/g, '')
		text += i + 1 + ' ' + tex + '\n'
	}
	text += '-\n'
	for (var i = 0; i < nodesTextures.length; i++) 
		text += (nodesTextures[i] + 1) + ' '
	text += '\n'
	for (var j = 0; j < 4; j++) {
		for (var i = 0; i < outerNodesTextures[j].length; i++) 
			text += (outerNodesTextures[j][i] + 1) + ' '
		text += '\n'
	}
	if (document.getElementById('minimap').checked)
		text += 'minimap 1\n'
	if (walls.length > 0) {
		text += 'walls ' + walls.length + '\n'
		for (var i = 0; i < walls.length; i++)
			text += walls[i].index + ' ' + walls[i].direction + ' ' + (walls[i].texture + 1) + '\n'
	}
	if (objects.length > 0) {
		text += 'objects ' + objects.length + '\n'
		for (var i = 0; i < objects.length; i++)
			text += Math.floor(objects[i].ind/size) + ' ' + objects[i].ind%size + ' ' + (objects[i].texture + 1) + '\n'
	}	
	document.getElementById('saveTexturesField').value = text
}

function mapEditor_loadTextures() {
	var text = document.getElementById('loadTexturesField').value.split('\n')
	if (text.length <= 1)
		return
	var i = 0
	for (; text[i] != '-'; i++) {
		texs = text[i].split(' ')
		var index = parseInt(texs[0]) - 1
		textures[index] = "textures/" + texs[1] + ".png" //Don't change path, please
		images[index] = new Image()
		images[index].src = previews[index]
	}
	var length = 0, big = size*size
	nodesTextures.length = 0
	while (length != big) {
		var nodes = text[++i].split(' ')
		var index = nodes.indexOf('')
		if (index != -1)
			nodes.splice(index, 1) //to remove last space
		nodesTextures.length += nodes.length
		for (var j = 0; j < nodes.length; j++)
			nodesTextures[length + j] = nodes[j] - 1
		length += nodes.length
	}
	i++
	for (var j = 0; j < 4; j++) {
		nodes = text[i++].split(' ')
		index = nodes.indexOf('')
		if (index != -1)
			nodes.splice(index, 1) //to remove last space
		outerNodesTextures[j].length = nodes.length
		for (var k = 0; k < outerNodesTextures[j].length; k++) 
			outerNodesTextures[j][k] = nodes[k] - 1
	}
	while (i < text.length) {
		if (text[i].search("minimap") != -1) { //load minimap
			if (text[i++].split(' ')[1] == '1')
				document.getElementById('minimap').checked = true
			else
				document.getElementById('minimap').checked = false
		}
		else if (text[i].search("walls") != -1) { //load walls
			var length = parseInt(text[i++].split(' ')[1])
			walls = []
			for (var j = 0; j < length; j++) {
				wall = text[i++].split(' ')
				walls.push({index: parseInt(wall[0]), direction: wall[1], texture: parseInt(wall[2]) - 1})
			}	
		}
		else if (text[i].search("objects") != -1) { //load objects
			var length = parseInt(text[i++].split(' ')[1])
			objects = []
			for (var j = 0; j < length; j++) {
				object = text[i++].split(' ') 
				objects.push({ind: parseInt(object[0])*size + parseInt(object[1]), texture: parseInt(object[2]) - 1})
			}
		}
		else
			i++
	}
	mapEditor_drawMap()
}

function mapEditor_sendToServer() {
	mapEditor_canvasToImg()
	mapEditor_completeMapInfo()
	mapEditor_saveTextures()
	document.forms['form'].submit()
}

function mapEditor_completeAndSave() {
	var input = document.createElement('input')
	input.setAttribute('name', 'complete')
	input.setAttribute('type', 'hidden')
	input.setAttribute('value', '1')
	document.forms['form'].appendChild(input)
	mapEditor_sendToServer()
}

function mapEditor_canvasToImg() {
	var width = document.getElementById('map').width 
	var height = document.getElementById('map').height
	document.getElementById('map').width = 256
	document.getElementById('map').height = 128
	var prevScale = scale, prevx = translatex, prevy = translatey
	scale = 256/(1.41*size*nodeSize)*0.95
	translatex = nodeSize*0.25*1.41*scale
	translatey = 64
	var prevEditor = editor
	mapEditor_selectEditor("textureEdit")
	var prevChecked = document.getElementById('opacity').checked
	document.getElementById('opacity').checked = true
	mapEditor_drawMap()
	document.getElementById('img').value = document.getElementById('map').toDataURL()
	document.getElementById('map').width = width
	document.getElementById('map').height = height
	scale = prevScale
	translatex = prevx
	translatey = prevy
	document.getElementById('opacity').checked = prevChecked
	mapEditor_selectEditor(prevEditor)
	mapEditor_drawMap()
}

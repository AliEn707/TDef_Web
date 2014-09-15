var size = 10
var gridSize = 600
var nodeSize = 0//gridSize/size
var mode = 0
var currentIndex = 0
var numberOfWaves = 0
var numbersOfParts = new Array()

var attribs = new Array(size*size)
var bases = new Array()
var respawns = new Array()

function setWalkData() {
	var obj = document.getElementsByName("walkdata")
	var text = ""
	for (var i = 0; i < size*size; i++)
		text += attribs[i].walk
	obj[0].setAttribute("value", text)
}

function setBuildData() {
	var obj = document.getElementsByName("builddata")
	var text = ""
	for (var i = 0; i < size*size; i++)
		text += attribs[i].buildable
	obj[0].setAttribute("value", text)
}

function respSelected(arg) {
	var selectedResps = new Array()
	for (var i in bases) {
		var obj = document.getElementById("b" + bases[i])
		if (obj != null) {
			var selectedIndex = obj.selectedIndex
			if (selectedIndex != -1 && obj.options[selectedIndex].value != -1)
				selectedResps.push(parseInt(obj.options[selectedIndex].value))
		}
	}
	for (var j in bases) {
		var list = document.getElementById('b' + bases[j])
		var length = list.options.length
		for (var i = 1; i < length; i++) {
			if (selectedResps.indexOf(parseInt(list.options[i].value)) != -1 && list.selectedIndex != i) {
				if (arg.id != 'b' + bases[j])
					list.options[i].setAttribute("disabled", "disabled")//list.options[i].setAttribute("hidden", "hidden")
			}
			else 
				list.options[i].removeAttribute("disabled")//list.options[i].removeAttribute("hidden")
		}
	}
}

function focusResp(arg) {
	unfocusResp(arg)
	currentIndex = arg.options[arg.selectedIndex].value
	var x = currentIndex%size, y = Math.floor(currentIndex/size)
	var mapCanvas = document.getElementById("map")
	var ctx = mapCanvas.getContext('2d')
	ctx.strokeStyle = "#ff7318"
	ctx.lineWidth = 5
	ctx.strokeRect(x*nodeSize + nodeSize*0.1 + 1, y*nodeSize + nodeSize*0.1 + 1, nodeSize*0.8, nodeSize*0.8)
}

function unfocusResp(arg) {
	var mapCanvas = document.getElementById("map")
	var ctx = mapCanvas.getContext('2d')
	if (currentIndex != -1)
		drawNode(parseInt(currentIndex))
}
	
function getClickXY(event) {
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
	var mapX = clickX/nodeSize, mapY = clickY/nodeSize
	var index = Math.floor(mapX)*size + Math.floor(mapY)
	switch(mode) {
		case 0:
			attribs[index].walk = attribs[index].walk == -1 ? 1 : --attribs[index].walk
			setWalkData()
			break
		case 1:
			attribs[index].buildable = (attribs[index].buildable + 1)&1
			setBuildData()
			break
		case 2:
			var pos = -1
			if ((pos = bases.indexOf(index)) == -1) {//no such element
				bases.push(index)
				var div = document.createElement('div')
				div.setAttribute("id", "base" + index)
				div.innerHTML = 'base' + index + ': '
				var list = document.createElement('select')
				list.setAttribute("name", "b" + index)
				list.setAttribute("id", "b" + index)
				list.setAttribute("onchange", "respSelected(this)")
				list.setAttribute("onmousemove", "focusResp(this)")
				list.setAttribute("onmouseout", "unfocusResp(this)")
				list.options[list.options.length] = new Option("none", -1)
				
				var selectedResps = new Array()
				for (var i in bases) {
					var obj = document.getElementById("b" + bases[i])
					if (obj != null) {
						var selectedIndex = obj.selectedIndex
						if (selectedIndex != -1 && obj.options[selectedIndex].value != -1)
							selectedResps.push(parseInt(obj.options[selectedIndex].value))
					}
				}
				for (var i in respawns) {
					if (selectedResps.indexOf(respawns[i]) == -1)
						list.options[list.options.length] = new Option("x: " + Math.floor(respawns[i]/size) + " y: " + respawns[i]%size, respawns[i])
				}
				div.appendChild(list)
				document.getElementById('basesDiv').appendChild(div)
			} else {
				bases.splice(pos, 1)
				var elem = document.getElementById('base' + index)
				elem.parentNode.removeChild(elem)
			}
			break
		case 3:
			var pos = -1
			if ((pos = respawns.indexOf(index)) == -1) { //no such element
				respawns.push(index)
				for (var i in bases) {
					var obj = document.getElementById("b" + bases[i])
					obj.options[obj.options.length] = new Option("x: " + Math.floor(mapX) + " y: " + Math.floor(mapY), index)
				}
			} else {
				respawns.splice(pos, 1)	
				for (var i in bases) {
					var obj = document.getElementById("b" + bases[i])
					for (var j in obj.options)
						if(obj.options[j].value == index) {
							obj.options[j].setAttribute("disabled", "disabled")//obj.options.remove(j)
							break
						}
				}
			}
			break
	}
	drawNode(index)
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
	obj = document.getElementById("wavesDiv")
	obj.style.height = window.innerHeight - 500
	obj.style.width = window.innerWidth*0.2 - 1
}

function drawMap() {
	for (var i = 0; i <= size*size; i++)
		drawNode(i)
}

function init() {
	numberOfWaves = 0
	var map = document.getElementById('map')
	map.addEventListener('click', getClickXY, false)
	for (var i = 0; i <= size; i++) {
		for (var j = 0; j < size; j++) {
			attribs[i*size + j] = {
				walk: 1, //1 - walk, 0 - see, -1 - nothing
				buildable: 0
			}
		}
	}
	currentIndex = 0
	var mapCanvas = document.getElementById("map"),
	ctx = mapCanvas.getContext('2d')
	setHeight(0)
	setWalkData()
	setBuildData()
}

function drawNode(index) {
	var y = Math.floor(index/size), x = index%size //awful
	var mapCanvas = document.getElementById("map"),
	ctx = mapCanvas.getContext('2d')
	ctx.lineWidth = 1
	if (attribs[index].walk == -1)
		ctx.fillStyle = "red"
	if (attribs[index].walk == 1)
		ctx.fillStyle = "#ffffff"	
	if (attribs[index].walk == 0)
		ctx.fillStyle = "blue"		
	ctx.fillRect(x*nodeSize+1, y*nodeSize+1, nodeSize, nodeSize)
	if (attribs[index].buildable == 1) {
		ctx.fillStyle = "#00ff00"	
		ctx.fillRect(x*nodeSize + nodeSize/4+1, y*nodeSize + nodeSize/4+1, nodeSize/2, nodeSize/2)
	}
	if (bases.indexOf(index) != -1) {
		ctx.fillStyle = "brown"
		ctx.beginPath()
		ctx.arc(x*nodeSize + nodeSize/2+1, y*nodeSize + nodeSize/2+1, nodeSize/5, 0, Math.PI*2, true)
		ctx.fill()
	}
	if (respawns.indexOf(index) != -1) {
		ctx.strokeStyle = "cyan"
		ctx.beginPath()
		ctx.arc(x*nodeSize + nodeSize/2+1, y*nodeSize + nodeSize/2+1, nodeSize*0.375, 0, Math.PI*2, true)
		ctx.stroke()
		ctx.beginPath()
		ctx.arc(x*nodeSize + nodeSize/2+1, y*nodeSize + nodeSize/2+1, nodeSize/4, 0, Math.PI*2, true)
		ctx.stroke()
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

function recalcNumberOfParts(partnum, wavenum) {
	for (var i = 2; i <= numbersOfParts[wavenum]; i++) {
		var inputs = document.getElementsByName('wave' + wavenum + '[part' + i + '[]]')
		if (inputs[0] != null) {
			if (document.getElementsByName('wave' + wavenum + '[part' + (i - 1) + '[]]')[0] == null) {
				inputs[0].parentNode.getElementsByTagName('span')[0].innerHTML = (i - 1)		
				var length = inputs.length
				for (var j = 0; j < length; j++)
					inputs[0].setAttribute('name','wave'+wavenum+ '[part' + (i - 1) + '[]]')
			}
		}
	}
	numbersOfParts[wavenum]--	
}

function deletePart(obj) {
	var partnum = parseInt(obj.parentNode.getElementsByTagName('span')[0].innerHTML)
	var wavenum = parseInt(obj.parentNode.parentNode.getElementsByTagName('span')[0].innerHTML)
	if (numbersOfParts[wavenum] == 1)
		deleteWave(obj.parentNode)
	else {
		obj.parentNode.parentNode.removeChild(obj.parentNode)
		recalcNumberOfParts(partnum, wavenum)
	}
}


function addPart(obj) {
	var num = parseInt(obj.parentNode.getElementsByTagName('span')[0].innerHTML)
	numbersOfParts[num]++
	var div = document.createElement('div')
	div.innerHTML = 'Part'
	var span = document.createElement('span')
	span.innerHTML = numbersOfParts[num]
	div.appendChild(span)
	obj.parentNode.appendChild(div)
	var inputs = new Array(4)
	for (var i = 0; i < 4; i++) {
		inputs[i] = document.createElement('input')
		inputs[i].setAttribute('type', 'value')
		inputs[i].setAttribute('name','wave'+num+ '[part' + numbersOfParts[num]+'[]]')
		inputs[i].setAttribute('size','3')
		div.appendChild(inputs[i])
	}
	var input=document.createElement('input')
	input.setAttribute('type', 'button')
	input.setAttribute('value', 'Delete')
	input.setAttribute('onclick', 'deletePart(this)')
	div.appendChild(input)
	var br=document.createElement('br')
}

function addWave() {
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
	buttonAdd.setAttribute('onclick', 'addPart(this)')
	
	var buttonDel = document.createElement('input')
	buttonDel.setAttribute('type', 'button')
	buttonDel.setAttribute('value', 'Del wave')
	buttonDel.setAttribute('onclick', 'deleteWave(this)')
	
	div.appendChild(span)
	div.appendChild(buttonAdd)	
	div.appendChild(buttonDel)
	addPart(div.getElementsByTagName('input')[0])
	document.getElementById('wavesDiv').appendChild(div)
}

function recalcNumberOfWaves() {
	for (var i = 2; i <= numberOfWaves; i++) {
		var span = document.getElementById("span" + i)
		if (span != null) {
			if (document.getElementById("span" + (i - 1)) == null) {
				for (var k = 1; k <= numbersOfParts[i]; k++) {
					var inputs = document.getElementsByName('wave' + i + '[part' + k + '[]]')
					if (inputs[0] != null) {
						var length = inputs.length
						for (var j = 0; j < length; j++)
							inputs[0].setAttribute('name', 'wave'+ (i - 1) + '[part' + k + '[]]')
					}
				}
				span.innerHTML = (i - 1)
				span.setAttribute('id', 'span' + (i - 1))
				numbersOfParts[i - 1] = numbersOfParts[i]
			}
		}
	}
	numberOfWaves--
}

function deleteWave(elem) {
	elem.parentNode.parentNode.removeChild(elem.parentNode)
	recalcNumberOfWaves()
}

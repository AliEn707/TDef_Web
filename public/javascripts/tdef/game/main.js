var canavas = document.getElementById('mainGameCanvas')
var canvasParent = canavas.parentNode

canavas.width = canvasParent.offsetWidth - 1
canavas.height = window.innerHeight - canvasParent.offsetTop - 5
var ctx = canavas.getContext('2d')
ctx.fillRect(0,0,canavas.width,canavas.height)

window.onresize = function() {
	canavas.width = canvasParent.offsetWidth - 1
	canavas.height = window.innerHeight - canvasParent.offsetTop - 5
	ctx.fillRect(0,0,canavas.width,canavas.height)
}

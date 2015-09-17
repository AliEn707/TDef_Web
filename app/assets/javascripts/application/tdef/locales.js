/*
╔══════════════════════════════════════════════════════════════╗
║ Locales editor                                                   ║
║ 										                       ║
║ created by Dennis Yarikov	                                   ║
║ sep 2014                                                     ║
╚══════════════════════════════════════════════════════════════╝
*/

var locales=[]
var locales_current=''
var locales_counter=0

var localesDelKeyTag="delkey[]"
var localesDelNameTag="delname[]"

function locales_change(obj){
	obj.parentNode.setAttribute("class","active")
	
	document.getElementById(locales_current).removeAttribute("class")
	
	document.getElementById("table_"+locales_current).style.display="none"//.setAttribute("hidden","")
	document.getElementById("table_"+obj.parentNode.id).style.display="table"//.removeAttribute("hidden")
	
	locales_current=obj.parentNode.id
}

function locales_edit(obj){
	setSubmission();
	tr=obj.parentNode.parentNode.parentNode
	size={"key": 10,"value":25}
	keys=["key","value"]
	for (t=0;t<keys.length;t++) {
		elem=tr.getElementsByTagName(keys[t])[0]
		if (typeof(elem)!='undefined'){
			td=elem.parentNode
			input=document.createElement("input")
			input.setAttribute("type","text")
			input.setAttribute("name",keys[t]+'[]')
			input.setAttribute("size",size[t])
			input.setAttribute("form","form")
			input.setAttribute("value",elem.getAttribute("value"))
			td.removeChild(elem)
			td.appendChild(input)
			//add old to del
			if (keys[t]=='key'){
				input=document.createElement("input")
				input.setAttribute("type","hidden")
				input.setAttribute("name",localesDelKeyTag)
				input.setAttribute("form","form")
				input.setAttribute("value",elem.getAttribute("value"))
				tr.appendChild(input)
				input=document.createElement("input")
				input.setAttribute("type","hidden")
				input.setAttribute("name",localesDelNameTag)
				input.setAttribute("form","form")
				input.setAttribute("value",locales_current)
				tr.appendChild(input)
			}
		}
	}
	tr.setAttribute('class','warning')
	
	input=document.createElement("input")
	input.setAttribute("type","hidden")
	input.setAttribute("name",'name[]')
	input.setAttribute("form","form")
	input.setAttribute("value",locales_current)
	tr.appendChild(input)
	//obj.setAttribute("disabled","")
}






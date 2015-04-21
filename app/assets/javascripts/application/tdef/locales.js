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

function locales_remove(obj){
	tr=obj.parentNode.parentNode.parentNode
	tds=tr.getElementsByTagName('td')
	keys=["name[]","key[]","value[]"]
	for (t=0;t<keys.length;t++) {
		elem=tr.getElementsByTagName(keys[t])[0]
		if (typeof(elem)!='undefined'){
			elem.removeAttribute("form")
		}
	}
	for (t=0;t<tds.length;t++) {
		tds[t].setAttribute("hidden","")
	}
	key=tr.getElementsByTagName("key")[0]
	if (typeof(key)!='undefined'){
		input=document.createElement("input")
		input.setAttribute("type","hidden")
		input.setAttribute("name",localesDelKeyTag)
		input.setAttribute("form","form")
		input.setAttribute("id","d_"+locales_counter)
		input.setAttribute("value",key.getAttribute("value"))
		tr.appendChild(input)
		input=document.createElement("input")
		input.setAttribute("type","hidden")
		input.setAttribute("name",localesDelNameTag)
		input.setAttribute("form","form")
		input.setAttribute("id","n_"+locales_counter)
		input.setAttribute("value",locales_current)
		tr.appendChild(input)
	}
	
	td=document.createElement("td")
	td.setAttribute('colspan',4)
	td.innerHTML='<div>something <button id="_'+locales_counter+'" class="btn btn-small btn-link" onclick=locales_restore(this)>Restore</button></div>'
	tr.appendChild(td)
	tr.setAttribute('class','error')
	locales_counter++
}

function locales_restore(obj){
	tr=obj.parentNode.parentNode.parentNode
	tds=tr.getElementsByTagName('td')
//	for (t of ["name[]","key[]","value[]","locale","key","value"]) {
	keys=["name[]","key[]","value[]"]
	for (t=0;t<keys.length;t++) {
		elem=tr.getElementsByTagName(keys[t])[0]
		if (typeof(elem)!='undefined'){
			elem.setAttribute("form","form")
		}
	}
	for (t=0;t<tds.length;t++) {
		tds[t].removeAttribute("hidden")
	}
	
	elem=obj.parentNode.parentNode
	elem.parentNode.removeChild(elem)
	
	d=document.getElementById('d'+obj.getAttribute("id"))
	if (typeof(key)!='undefined'){
		d.parentNode.removeChild(d)
	}
	d=document.getElementById('n'+obj.getAttribute("id"))
	if (typeof(key)!='undefined'){
		d.parentNode.removeChild(d)
	}
	tr.setAttribute('class','warning')
}

function locales_add(obj){
	table=document.getElementById("table_"+locales_current)
	tbody=table.getElementsByTagName("tbody")[0]
	//row=document.createElement("tr")
	row=tbody.insertRow(0)
	td=document.createElement("td")
	td.innerHTML=locales_current
	input=document.createElement("input")
	input.setAttribute('type','hidden')
	input.setAttribute('form','form')
	input.setAttribute('name','name[]')
	input.setAttribute("value",locales_current)
	row.appendChild(input)
	row.appendChild(td)
	
	size={"key": 10,"value":25}
	keys=["key","value"]
	for (t=0;t<keys.length;t++) {
		td=document.createElement("td")
		input=document.createElement("input")
		input.setAttribute("type","text")
		input.setAttribute("name",keys[t]+'[]')
		input.setAttribute("size",size[keys[t]])
		input.setAttribute("form","form")
		td.appendChild(input)
		row.appendChild(td)
	}
	row.setAttribute('class','warning')
	td=document.createElement("td")
	td.innerHTML='<div class="btn-group"><button class="btn btn-small btn-danger" onclick="locales_remove(this)"><i class="icon-remove"></i></button></div>'
	row.appendChild(td)
	//tbody.appendChild(row)
}

function locales_new(obj){
	var tr=obj.parentNode.parentNode.parentNode
	var tabs=document.getElementById("tabs")
	var name=document.getElementById("newloc").value
	
	if (!document.getElementById(name)){
		tabs.innerHTML+='<li id='+name+'><a href="#", onclick="locales_change(this)">'+name+'</a></li>'
		var all=document.getElementById("locales_all")
		all.innerHTML+='<table class="table table-striped" id="table_'+name+'" style="display: none;"><tbody></tbody></table>'
	}
	var li=document.getElementById(name)
	locales_change(li.children[0])
}






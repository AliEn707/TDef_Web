
/*
╔══════════════════════════════════════════════════════════════╗
║ servers editor                                                   ║
║ 										                       ║
║ created by Dennis Yarikov	                                   ║
║ sep 2014                                                     ║
╚══════════════════════════════════════════════════════════════╝
*/

var servers_counter=0

var serversDelPortTag="delport[]"
var serversDelHostnameTag="delhostname[]"

function servers_edit(obj){
	setSubmission();
	tr=obj.parentNode.parentNode.parentNode
	size={"hostname": 25,"port":8,"rooms":8,"startport":8}
	keys=["hostname","port","rooms","startport"]
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
			if (keys[t]=="hostname"){
				input=document.createElement("input")
				input.setAttribute("type","hidden")
				input.setAttribute("name",serversDelHostnameTag)
				input.setAttribute("form","form")
				input.setAttribute("value",elem.getAttribute("value"))
				tr.appendChild(input)
			}
			if (keys[t]=="port"){
				input=document.createElement("input")
				input.setAttribute("type","hidden")
				input.setAttribute("name",serversDelPortTag)
				input.setAttribute("form","form")
				input.setAttribute("value",elem.getAttribute("value"))
				tr.appendChild(input)
			}
		}
	}
	tr.setAttribute('class','warning')
	
	//obj.setAttribute("disabled","")
}

function servers_remove(obj){
	setSubmission();
	tr=obj.parentNode.parentNode.parentNode
	tds=tr.getElementsByTagName('td')
	keys=["hostname[]","port[]","rooms[]","startport[]"]
	for (t=0;t<keys.length;t++) {
		elem=tr.getElementsByTagName(keys[t])[0]
		if (typeof(elem)!='undefined'){
			elem.removeAttribute("form")
		}
	}
	for (t=0;t<tds.length;t++) {
		tds[t].setAttribute("hidden","")
	}
	key=tr.getElementsByTagName("hostname")[0]
	if (typeof(key)!='undefined'){
		input=document.createElement("input")
		input.setAttribute("type","hidden")
		input.setAttribute("name",serversDelHostnameTag)
		input.setAttribute("form","form")
		input.setAttribute("id","d_"+servers_counter)
		input.setAttribute("value",key.getAttribute("value"))
		tr.appendChild(input)
	}
	key=tr.getElementsByTagName("port")[0]
	if (typeof(key)!='undefined'){
		input=document.createElement("input")
		input.setAttribute("type","hidden")
		input.setAttribute("name",serversDelPortTag)
		input.setAttribute("form","form")
		input.setAttribute("id","n_"+servers_counter)
		input.setAttribute("value",key.getAttribute("value"))
		tr.appendChild(input)
	}
	
	td=document.createElement("td")
	td.setAttribute('colspan',4)
	td.innerHTML='<div>something <button id="_'+servers_counter+'" class="btn btn-small btn-link" onclick=servers_restore(this)>Restore</button></div>'
	tr.appendChild(td)
	tr.setAttribute('class','error')
	servers_counter++
}

function servers_restore(obj){
	tr=obj.parentNode.parentNode.parentNode
	tds=tr.getElementsByTagName('td')
//	for (t of ["name[]","key[]","value[]","locale","key","value"]) {
	keys=["hostname[]","port[]","rooms[]","startport[]"]
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

function servers_add(obj){
	setSubmission();
	table=document.getElementById("table_servers")
	tbody=table.getElementsByTagName("tbody")[0]
	//row=document.createElement("tr")
	row=tbody.insertRow(0)
	
	size={"hostname": 25,"port":8,"rooms":8,"startport":8}
	keys=["hostname","port","rooms","startport"]
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
	td.innerHTML='<div class="btn-group"><button class="btn btn-small btn-danger" onclick="servers_remove(this)"><i class="icon-remove"></i></button></div>'
	row.appendChild(td)
	//tbody.appendChild(row)
}

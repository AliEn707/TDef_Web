var Post={
	choose_lang: function (lang, current_post){
		if (lang==Post.current_lang[current_post])
			return; 
		var n_n=document.getElementById("lang_"+lang+"_"+current_post);
		if (n_n){
			n_n.removeAttribute("hidden");
			document.getElementById("lang_"+Post.current_lang[current_post]+"_"+current_post).setAttribute("hidden","");
			document.getElementById("tab_"+Post.current_lang[current_post]+"_"+current_post).removeAttribute("class");
			document.getElementById("tab_"+lang+"_"+current_post).setAttribute("class","active");
			Post.current_lang[current_post]=lang;
		}else{
			xmlhttp=new XMLHttpRequest();
			xmlhttp.onreadystatechange=function() {
				var l=lang;
				if (xmlhttp.readyState==4){
					var l_l=document.getElementById("lang_"+l+"_"+current_post);
					if (xmlhttp.status==200){
						l_l.innerHTML=xmlhttp.responseText;
					}
					Post.choose_lang(l,current_post);
				}
			}
			xmlhttp.open("GET","/post/translation/"+current_post+"?lang="+lang,true);
			xmlhttp.send();
			var place=document.getElementById("translations");
			var l_l=document.createElement("div");
			l_l.setAttribute("id","lang_"+lang+"_"+current_post);
			l_l.setAttribute("hidden","");
			l_l.innerHTML="<div class='loading'></div>"
			place.appendChild(l_l);
		}	
	},
	current_lang: {},
	init: function(lang, post){
		Post.current_lang[post]=lang;
	},
}
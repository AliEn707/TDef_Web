module MapHelper
	def walkmark(name,checked)
		o= '<div class="walkmark">
			<input class="hidden" type="checkbox" value="None" id="'+name+'" name="'+name+(checked==true ? '" checked' : '"')+'/>
			<label for="'+name+'"></label>
		</div>'
		o.html_safe
	end
	def buildmark(name,checked)
		o= '<div class="buildmark">
			<input class="hidden" type="checkbox" value="None" id="'+name+'" name="'+name+(checked==true ? '" checked' : '"')+'/>
			<label for="'+name+'"></label>
		</div>'
		o.html_safe
	end
	
	def mark(name,checked)
		o= '<div class="buildmark">
			<input class="hidden" type="checkbox" value="None" id="'+name+'" name="'+name+(checked==true ? '" checked' : '"')+'/>
			<label for="'+name+'"></label>
		</div>'
		o.html_safe
	end
	
	
	def node(name,w,b)
		walkmark(name+'w',w)+buildmark(name+'b',b)
	end
	def grid(size=10)
		nl='
		'
		a='<style type="text/css">
		    td 
		    {
				width:20px;
				text-align:center;
				valign: 0;
		    }
		    .td1 
		    {
				width:20px;
				text-align:center;
				valign: 0;
		    }
		    
		</style>
		<table width= 200>
			<tr>
				<td>
					'+walkmark('w',true)+'
				</td>
				<td>
					- may walk
				</td>
			<tr>
			</tr>
				<td>
					'+buildmark('b',true)+'
				</td>
				<td>
					- may build
				</td>
			</tr>
		</table>
		<table border="1" cellpadding="0" cellspacing="0" >
		'
		(size*2).times do |i|
			n=i+1
			n=size*2-n if (n>size)
			l=(2*size-n*2)/2
			a+="<tr>"
			l.times {a+="<td></td>"+nl}
			n.times do |j|
				m=j+1
				name=((i+1)>size ? ((m+i+1-size)*size-((i+1)-(m+i+1-size))) : (m*size-(n-m)))-1
				a+='<td colspan="2" '+
					#'bgcolor=#ff0000'+
					'>'+
				#	node((name-1).to_s,true,true)+
					mark(name.to_s,true)+
					'</td>
					'
			end
			l.times {a+="<td></td>"+nl}
			a+="</tr>
			"
		end
		
		a+='</table>
		'
		a.html_safe
	end
	
	def map_columns
		['icon', 'name', 'completed']
	end
end

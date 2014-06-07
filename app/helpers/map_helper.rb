module MapHelper

	def grid
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
		    
		</style>'+
		'<table border="1" cellpadding="0" cellspacing="0" >
			<tr>
				<td colspan="1" ></td>
				<td colspan="1"></td>
				<td colspan="2">C</td>
				<td colspan="1"></td>
				<td colspan="1"></td>
			</tr>
			<tr>
				<td colspan="1"></td>
				<td colspan="2">G</td>
				<td colspan="2">H</td>
				<td colspan="1"></td>
			</tr>
			<tr>
				<td colspan="2">J</td>
				<td colspan="2">K</td>
				<td colspan="2">L</td>
			</tr>
			<tr>
				<td colspan="1"></td>
				<td colspan="2">M</td>
				<td colspan="2">N</td>
				<td colspan="1"></td>
				
			</tr>
			<tr>
				<td colspan="1"></td>
				<td colspan="1"></td>
				<td colspan="2">O</td>
				<td colspan="1"></td>
				<td colspan="1"></td>
			</tr>
			
		</table>'
		a.html_safe
	end
end

module ApplicationHelper
	def checkbox_onoff(name,label,value='1',checked=false)
		o= '<div class="slideThree">
			<input class="hidden" type="checkbox" value="'+value+'" id="'+name+'" name="'+name+(checked==true ? '" checked' : '"')+'/>
			<label for="'+name+'">'+label+'</label>
		</div>
		'
		o.html_safe
	end
	
	def checkbox_slide_small(name,label,value='1',checked=false)
		o= '<div class="slideOne">
			<input class="hidden" type="checkbox" value="'+value+'" id="'+name+'" name="'+name+(checked==true ? '" checked' : '"')+'/>
			<label for="'+name+'">'+label+'</label>
		</div>
		'
		o.html_safe
	end
	
	def menu 
		a=[]
		if !current_user.nil?
			a<<["Hello "+current_user.email,{'name'=>t(:log_out),'path'=>destroy_user_session_path,:method => :delete},
					{'name'=>t(:edit_registration),'path' => edit_user_registration_path}]
			if current_user.admin
				a<<["Content",{'name'=>t(:map_editor),'path'=>"/map/edit"},
					{'name'=>t(:maps),'path'=>"/map/show_all"},
					{'name'=>t(:locales),'path'=>"/locales/show_all"}]
			end
		else
			a<<[{'name'=>t(:login),'path'=> new_user_session_path}]
			a<<[{'name' => t(:register) , 'path' => new_user_registration_path}]			
		end
		a<<[t(:locale),{'name'=>"Ru",'path'=>"/locale?locale=ru"},
					{'name'=>"Fr",'path' =>"/locale?locale=fr"},
			true]
		a	
	end
end

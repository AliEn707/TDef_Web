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
			a<<["Hello "+current_user.email,{'name'=>"Log out",'path'=>destroy_user_session_path,:method => :delete},
					{'name'=>'Edit registration','path' => edit_user_registration_path}]
			if current_user.admin
				a<<["Content",{'name'=>"Map editor",'path'=>"/map/edit"},
					{'name'=>"Locales",'path'=>"/locales/show_all"}]
			end
		else
			a<<[{'name'=>'Login','path'=> new_user_session_path}]
			a<<[{'name' => "Register" , 'path' => new_user_registration_path}]			
		end
		a	
	end
end

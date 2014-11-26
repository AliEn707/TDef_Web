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
			a<<[{'name'=>t(:hello)+' '+current_user.email,'right'=>true},
					{'name'=>t(:log_out),'path'=>destroy_user_session_path,:method => :delete},
					{'name'=>t(:edit_registration),'path' => edit_user_registration_path}]
			if current_user.admin
				a<<[{'name'=>t(:content)},
						{'name'=>t(:map_editor),'path'=>map_edit_path},
						{'name'=>t(:maps),'path'=>map_all_path},
						{'name'=>t(:locales),'path'=>locales_all_path}]
			end
			locale=[]
			locale<<{'name'=>current_user.locale,'right'=>true}
			['ru','en'].each do |l_l|
				locale<<{'name'=>l_l,'path'=>"/locale?locale="+l_l}
			end
			a<<locale
#			a<<{'name'=>Dir[Rails.root.join('locales', '*.{rb,yml}').to_s],'path'=>'#'}
		else
			a<<[{'name'=>t(:login),'path'=> new_user_session_path}]
			a<<[{'name' => t(:register) , 'path' => new_user_registration_path}]			
		end
		a	
	end
	
end

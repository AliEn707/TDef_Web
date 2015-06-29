TDefWeb::Application.routes.draw do
  namespace :tdef do
    namespace :type do
      resources :npcs
      resources :towers
    end
  end

  namespace :post do
    resources :translations
  end
	resources :posts
	#for ajax calls
	get "/post/translation/:id" => "post/translations#post"
	
	get "friends" => "friendships#show" 
	post "friendship/:id" => "friendships#create" , as: "friendship" 
	delete "friendship/:id" => "friendships#destroy" 

	get "messages" => "messages#show", as: "messages" 
	post "messages" => "messages#create" 

	get "qrcode" =>"qrcode#qrcode", as: "qrcode"
	get "image/:id" => 'images#get', as: "get_image"
	post "image/upload" => 'images#upload', as: "upload_image"

	devise_for :users, controllers: { registrations: 'registrations' }

	get "locale", to: "application#set_locale"

	get "test/test"
	# The priority is based upon order of creation: first created -> highest priority.
	# See how all your routes lay out with "rake routes".
	# root 'welcome#index'
	get "/TDef/mapservers/show" => "tdef/map_server#show", as: "tdef_server_all"
	post "/TDef/mapservers/show" => "tdef/map_server#show"
	get "/TDef/mapservers/info/:id" => 'tdef/map_server#info' , as: "tdef_server_info"

	get "/TDef/locales/show_all" => "tdef/locales#show_all" , as: "tdef_locales_all"
	post "/TDef/locales/show_all" => "tdef/locales#show_all"
	post "/TDef/locales/edit" => "tdef/locales#edit", as: "tdef_locales_edit"
	delete "/TDef/locales/remove" => "tdef/locales#remove", as: "tdef_locales_remove"

	post "/TDef/map/upload" => "tdef/map#upload", as: "tdef_map_upload"
	get "/TDef/map/upload" => "tdef/map#upload"
	post "/TDef/map/edit" => "tdef/map#edit", as: "tdef_map_edit"
	get "/TDef/map/edit" => "tdef/map#edit"
	get "/TDef/map/complete" => "tdef/map#complete", as: "tdef_map_complete"
	get "/TDef/map/textures" => "tdef/map#textures", as: "tdef_map_textures"
	get "/TDef/map/show_all" => "tdef/map#show_all", as: "tdef_map_all"
	get "/TDef/map/delete/:id" => "tdef/map#delete", as: "tdef_map_delete"
	#map rout for ajax load
	get "/TDef/map/get" => "tdef/map#get", as: "tdef_map_get"
	#types routes for js load
	get "/TDef/types/npc" => "tdef/type/npcs#types", as: "types_npc"
	get "/TDef/types/tower" => "tdef/type/towers#types", as: "types_tower"
	#main game rout
	get "/TDef/game" => "tdef/game#game", as: "tdef_game"
	
	root "posts#index"
	# You can have the root of your site routed with "root"
	
	# Example of regular route:
	#   get 'products/:id' => 'catalog#view'

	# Example of named route that can be invoked with purchase_url(id: product.id)
	#   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

	# Example resource route (maps HTTP verbs to controller actions automatically):
	#   resources :products

	# Example resource route with options:
	#   resources :products do
	#     member do
	#       get 'short'
	#       post 'toggle'
	#     end
	#
	#     collection do
	#       get 'sold'
	#     end
	#   end

	# Example resource route with sub-resources:
	#   resources :products do
	#     resources :comments, :sales
	#     resource :seller
	#   end

	# Example resource route with more complex sub-resources:
	#   resources :products do
	#     resources :comments
	#     resources :sales do
	#       get 'recent', on: :collection
	#     end
	#   end

	# Example resource route with concerns:
	#   concern :toggleable do
	#     post 'toggle'
	#   end
	#   resources :posts, concerns: :toggleable
	#   resources :photos, concerns: :toggleable

	# Example resource route within a namespace:
	#   namespace :admin do
	#     # Directs /admin/products/* to Admin::ProductsController
	#     # (app/controllers/admin/products_controller.rb)
	#     resources :products
	#   end
end

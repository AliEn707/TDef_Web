class Tdef::Type::TowersController < ApplicationController
  before_action :set_tdef_type_tower, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!,  except: [:types]
  before_action :is_admin?,  except: [:types]
  
  # GET /tdef/type/towers
  # GET /tdef/type/towers.json
  def index
    @tdef_type_towers = Tdef::Type::Tower.all
  end

  # GET /tdef/type/towers/1
  # GET /tdef/type/towers/1.json
  def show
  end

  # GET /tdef/type/towers/new
  def new
    @tdef_type_tower = Tdef::Type::Tower.new
  end

  # GET /tdef/type/towers/1/edit
  def edit
  end

  # POST /tdef/type/towers
  # POST /tdef/type/towers.json
  def create
	@tdef_type_tower = Tdef::Type::Tower.new(tdef_type_tower_params)
	@tdef_type_tower.set_textures(params[:tdef_type_tower]["textures"])
	if (@tdef_type_tower.save)
		redirect_to edit_tdef_type_tower_path(@tdef_type_tower), notice: 'Tower was successfully created.'
	else
		render action: 'new' 
	end
  end

  # PATCH/PUT /tdef/type/towers/1
  # PATCH/PUT /tdef/type/towers/1.json
  def update
    @tdef_type_tower.set_textures(params[:tdef_type_tower]["textures"])
    if (@tdef_type_tower.update(tdef_type_tower_params))
      redirect_to @tdef_type_tower, notice: 'Tower was successfully updated.'
    else
      render action: 'edit'
    end
  end

  # DELETE /tdef/type/towers/1
  # DELETE /tdef/type/towers/1.json
  def destroy
    @tdef_type_tower.destroy
    redirect_to tdef_type_towers_url
  end

  def types
	data="var tower_types="+Rails.cache.fetch('types/tower',expires_in: 30.minutes) do
		out={}
		images=[]
		Tdef::Type::Tower.all.each do |t|
			out[t.id]={"id"=>t.id}.merge(t.params)
			out[t.id]["textures"]=t.textures.to_hash
			out[t.id]["textures"].each do |type, tex|
				images<<tex["src"]
			end
		end
		out.to_json#+images.map!{|i| ";var a=new Image;a.src='#{i}'"}.join #preloading images
	end
	expires_in 20.minutes, public: true
	send_data(data,type: "text/javascript; charset=utf-8", filename: "tower_types.js", disposition:'inline')	
  end
  private

    # Use callbacks to share common setup or constraints between actions.
    def set_tdef_type_tower
      @tdef_type_tower = Tdef::Type::Tower.find(params[:id])
    end
    
   # Never trust parameters from the scary internet, only allow the white list through.
    def tdef_type_tower_params
      params.require(:tdef_type_tower).permit(:params=>params[:tdef_type_tower][:params].try(:keys))
    end
end

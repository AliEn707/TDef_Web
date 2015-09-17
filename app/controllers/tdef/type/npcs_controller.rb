class Tdef::Type::NpcsController < ApplicationController
  before_action :set_tdef_type_npc, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!,  except: [:types]
  before_action :is_admin?,  except: [:types]

  # GET /tdef/type/npcs
  # GET /tdef/type/npcs.json
  def index
    @tdef_type_npcs = Tdef::Type::Npc.all
  end

  # GET /tdef/type/npcs/1
  # GET /tdef/type/npcs/1.json
  def show
  end

  # GET /tdef/type/npcs/new
  def new
    @tdef_type_npc = Tdef::Type::Npc.new
  end

  # GET /tdef/type/npcs/1/edit
  def edit
  end

  # POST /tdef/type/npcs
  # POST /tdef/type/npcs.json
  def create
	@tdef_type_npc = Tdef::Type::Npc.new(tdef_type_npc_params)
	@tdef_type_npc.set_textures(params[:tdef_type_npc]["textures"])
    respond_to do |format|
      if @tdef_type_npc.save
		format.html { redirect_to edit_tdef_type_npc_path(@tdef_type_npc), notice: 'Npc was successfully created.' }
      else
        format.html { render action: 'new' }
      end
    end
  end

  # PATCH/PUT /tdef/type/npcs/1
  # PATCH/PUT /tdef/type/npcs/1.json
  def update
    @tdef_type_npc.set_textures(params[:tdef_type_npc]["textures"])
    respond_to do |format|
      if @tdef_type_npc.update(tdef_type_npc_params)
        format.html { redirect_to @tdef_type_npc, notice: 'Npc was successfully updated.' }
      else
        format.html { render action: 'edit' }
      end
    end
  end

  # DELETE /tdef/type/npcs/1
  # DELETE /tdef/type/npcs/1.json
  def destroy
    @tdef_type_npc.destroy
    respond_to do |format|
      format.html { redirect_to tdef_type_npcs_url }
    end
  end

  def types
	data="TDef=TDef||{};TDef.types=TDef.types||{};TDef.types.npc="+Rails.cache.fetch('types/npc',expires_in: 30.minutes) do
		out={}
		images=[]
		Tdef::Type::Npc.all.each do |t|
			out[t.id]={"id"=>t.id}.merge(t.params)
			out[t.id]["textures"]=t.textures.to_hash
			out[t.id]["textures"].each do |type, tex|
				images<<tex["src"]
			end
		end
		out.to_json#+images.map!{|i| ";var a=new Image;a.src='#{i}'"}.join #preloading images
	end 
	expires_in 20.minutes, public: true
	send_data(data,type: "text/javascript; charset=utf-8", filename: "npc_types.js", disposition:'inline')	
  end
  private

    # Use callbacks to share common setup or constraints between actions.
    def set_tdef_type_npc
      @tdef_type_npc = Tdef::Type::Npc.find(params[:id])
    end
    
   # Never trust parameters from the scary internet, only allow the white list through.
    def tdef_type_npc_params
      params.require(:tdef_type_npc).permit(:params=>params[:tdef_type_npc][:params].try(:keys))
    end
end

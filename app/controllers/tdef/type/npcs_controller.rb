class Tdef::Type::NpcsController < ApplicationController
  before_action :set_tdef_type_npc, only: [:show, :edit, :update, :destroy]
  before_action :remove_textures, only: [:show, :edit]
  before_action :authenticate_user!
  before_action :is_admin?

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

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_tdef_type_npc
      @tdef_type_npc = Tdef::Type::Npc.find(params[:id])
    end
    
	def remove_textures
		@tdef_type_npc.params.delete("textures")
	end
    # Never trust parameters from the scary internet, only allow the white list through.
    def tdef_type_npc_params
      params.require(:tdef_type_npc).permit(:params=>params[:tdef_type_npc][:params].try(:keys))
    end
end

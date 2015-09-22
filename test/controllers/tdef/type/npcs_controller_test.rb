require 'test_helper'

class Tdef::Type::NpcsControllerTest < ActionController::TestCase
  setup do
     sign_in(users(:admin))
    @tdef_type_npc = tdef_type_npcs(:one)
 end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:tdef_type_npcs)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create tdef_type_npc" do
    assert_difference('Tdef::Type::Npc.count') do
      post :create, tdef_type_npc: { params: @tdef_type_npc.params }
    end

    assert_redirected_to edit_tdef_type_npc_path(assigns(:tdef_type_npc))
  end

  test "should show tdef_type_npc" do
    get :show, id: @tdef_type_npc
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @tdef_type_npc
    assert_response :success
  end

  test "should update tdef_type_npc" do
    patch :update, id: @tdef_type_npc, tdef_type_npc: { params: @tdef_type_npc.params }
    assert_redirected_to tdef_type_npc_path(assigns(:tdef_type_npc))
  end

  test "should destroy tdef_type_npc" do
    assert_difference('Tdef::Type::Npc.count', -1) do
      delete :destroy, id: @tdef_type_npc
    end

    assert_redirected_to tdef_type_npcs_path
  end
end

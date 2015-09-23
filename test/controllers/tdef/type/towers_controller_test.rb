require 'test_helper'

class Tdef::Type::TowersControllerTest < ActionController::TestCase
  setup do
     sign_in(users(:admin))
    @tdef_type_tower = tdef_type_towers(:one)
 end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:tdef_type_towers)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create tdef_type_tower" do
    assert_difference('Tdef::Type::Tower.count') do
      post :create, tdef_type_tower: { params: @tdef_type_tower.params }
    end

    assert_redirected_to edit_tdef_type_tower_path(assigns(:tdef_type_tower))
  end

  test "should show tdef_type_tower" do
    get :show, id: @tdef_type_tower
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @tdef_type_tower
    assert_response :success
  end

  test "should update tdef_type_tower" do
    patch :update, id: @tdef_type_tower, tdef_type_tower: { params: @tdef_type_tower.params }
    assert_redirected_to tdef_type_tower_path(assigns(:tdef_type_tower))
  end

  test "should destroy tdef_type_tower" do
    assert_difference('Tdef::Type::Tower.count', -1) do
      delete :destroy, id: @tdef_type_tower
    end

    assert_redirected_to tdef_type_towers_path
  end
  
  test "should get types as valid js" do
    get :types
    assert_response :success
    assert_not_nil response.body
    assert_not_nil ExecJS.compile(response.body)
  end
end

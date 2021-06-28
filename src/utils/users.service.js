import apiClient from "./apiClient";
class UserService{
    getAllUsers = () =>apiClient().get('users');
}
export default new UserService();
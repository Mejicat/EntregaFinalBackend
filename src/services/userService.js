import {userRepository} from "../repositories/index.js" ;
import UserDTO from "../dao/dto/userDTO.js";

class UserService {
    async getUsers() {
        try {
          const users = await userRepository.getUsers()
          if (!users) {
            throw new Error("No users found")
          }
          return users.map((user) => new UserDTO(user))
        } catch (error) {
          throw error;
        }
      }
    
      async getUserById(userId) {
        try {
          const user = await userRepository.getUserById(userId)
          if (!user) {
            throw new Error("User not found")
          }
          return new UserDTO(user)
        } catch (error) {
          throw error
        }
      }
    
      async registerUser(user) {
        try {
          const newUser = await userRepository.registerUser(user)
          if (!newUser) {
            throw new Error("Error registering user")
          }
          return new UserDTO(newUser);
        } catch (error) {
          throw error
        }
      }
    
      async verifyUser(userId) {
        try {
          const user = await userRepository.verifyUser(userId);
          if (!user) {
            throw new Error("Error al verificar al usuario")
          }
          return new UserDTO(user);
        } catch (error) {
          throw error
        }
      }
    
      async updateUserRole (userId, cartId) {
        try {
          const user = await userRepository.updateUserRole(userId, cartId);
          if (!user) {
            throw new Error("Error al actualizar al usuario");
          }
          return new UserDTO(user);
        } catch (error) {
          throw error
        }
      }
    
      async findUserEmail(email) {
        try {
          const user = await userRepository.findUserEmail(email);
          if (user) {
            return new UserDTO(user);
          } else {
            return null;
          }
        } catch (error) {
          throw error
        }
      }

      async updateUserPassword(userId, newPassword) {
        try {
          const updatedUser = await userRepository.updateUserPassword(userId, newPassword);
          return new UserDTO(updatedUser);
        } catch (error) {
          throw error;
        }
      }

      async deleteUserByEmail(email) {
        try {
          await this.dao.deleteUserByEmail(email);
        } catch (error) {
          throw new Error(`Error deleting user: ${error.message}`);
        }
      }

    }

export default UserService

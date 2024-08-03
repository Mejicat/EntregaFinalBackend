import nodemailer from 'nodemailer';

import { userRepository } from "../repositories/index.js";
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

  async updateUserRole(userId, cartId) {
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

  async updateLastConnection(userId) {
    try {
      const user = await userRepository.updateLastConnection(userId);
      if (!user) {
        throw new Error("Error updating last connection");
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async uploadDocuments(userId, documents) {
    try {
      const user = await userRepository.uploadDocuments(userId, documents);
      if (!user) {
        throw new Error("Error uploading documents");
      }
      return new UserDTO(user);
    } catch (error) {
      throw new Error(`Error in userService uploading documents: ${error.message}`);
    }
  }

  async handleInactiveUsers(inactivityPeriod, action) {
    try {
      const inactiveUsers = await userRepository.findInactiveUsers(inactivityPeriod);
      if (!inactiveUsers.length) {
        return { message: "No inactive users found" };
      }

      const results = [];
      for (const user of inactiveUsers) {
        if (action === 'delete') {
          await userRepository.deleteUser(user._id);
          results.push({ user: user._id, status: 'deleted' });
        } else {
          await userRepository.deactivateUser(user._id);
          results.push({ user: user._id, status: 'deactivated' });
        }
      }

      return results;
    } catch (error) {
      throw new Error(`Error handling inactive users: ${error.message}`);
    }
  }

  async deleteUser(userId) {
    try {
      await userRepository.deleteUser(userId);
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  async sendEmailNotification(email, subject, message) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: message,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error(`Error sending email: ${error.message}`);
    }
  }


}

export default UserService

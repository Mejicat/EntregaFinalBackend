import jwt from "jsonwebtoken"

import { isValidPassword } from "../utils/bcrypt.js"
import userModel from "./models/userModel.js"

class UserDAO {
  static instance = null;
  
  constructor() {
    if (!UserDAO.instance) {
      UserDAO.instance = this;
    }
    return UserDAO.instance;
  }

  static getInstance() {
    if (!UserDAO.instance) {
      UserDAO.instance = new UserDAO();
    }
    return UserDAO.instance;
  }

  async getUsers() {
    try {
      const users = await userModel.find({}).lean()
      return users;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getUserById(userId) {
    try {
      return await userModel.find({ _id: userId }).lean()
    } catch (error) {
      console.error("Error al obtener usuario:", error)
      throw new Error("Usuario inexistente")
    }
  }

  async registerUser(user) {
    const { first_name, last_name, email, age, password } = user

    if (!first_name || !last_name || !email || !age || !password) {
      throw new Error("Error al registrar el usuario, faltan datos mandatorios")
    }

    try {
      let newUser = await userModel.create({
        first_name: first_name || '',
        last_name: last_name || '',
        email,
        age: age || 0,
        password: password || ''
      })

      if (user.email === "adminCoder@coder.com" && isValidPassword(user, 'adminCod3r123')) {
        newUser.role = "admin"
        await newUser.save()
      }
      return newUser
    } catch (error) {
      console.error("Error al registrar usuario:", error)
      throw error
    }
  }

  async login(email, password) {
    if (!email || !password) {
      throw new Error("Datos de acceso inválidos. Verificar e reintentar nuevamente.")
    }

    try {
      const user = await userModel.findOne({ email }).lean()

      if (!user) throw new Error("Credenciales inválidas")

      if (isValidPassword(user, password)) {
        delete user.password
        return jwt.sign(user, "coderSecret", { expiresIn: "1h" })
      }

      throw new Error("Credenciales inválidas")
    }

    catch (error) {
      console.error("Error al intentar hacer login:", error)
      throw new Error("Error al intentar hacer login")
    }
  }

  async verifyUser(userId) {
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      user.verified = true;
      await user.save();
      return user;
    } catch (error) {
      console.error("Error al verificar usuario:", error);
      throw error;
    }
  }

  async updateUser(userId, cartId) {
    try {
      const result = await userModel.findByIdAndUpdate(userId, { cart: cartId })
      return result
    } catch (error) {
      console.error("Error al actualizar usuario:", error)
      throw error
    }
  }

  async updateUserPassword(userId, newPassword) {
    try {
      const updatedUser = await userModel.findByIdAndUpdate(
        userId, 
        { password: newPassword },
        { new: true }  // Para devolver el documento actualizado
      );
      return updatedUser;
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      throw new Error("Error al actualizar la contraseña");
    }
  }

  async updateUserRole(userId, newRole) {
    try {
      const result = await userModel.findByIdAndUpdate(userId, { role: newRole }, { new: true });
      return result;
    } catch (error) {
      console.error("Error al actualizar el rol del usuario:", error);
      throw error;
    }
  }

  async findUserEmail(email) {
    try {
      const result = await userModel.findOne({ email: email })
      return result
    } catch (error) {
      console.error("Error al buscar usuario por email:", error)
      throw error
    }
  }

  async deleteUserByEmail(email) {
    return await userModel.deleteOne({ email });
  }

  async updateLastConnection(userId) {
    try {
      const user = await userModel.findByIdAndUpdate(userId, {lastConnection: Date.now()}, {new: true})
      return user
    } catch (error) {
      throw error
    }
  }

  async uploadDocuments(userId, documents) {
    try {
      return await userModel.findByIdAndUpdate(userId, { $push: { documents } }, { new: true });
    } catch (error) {
      throw error
    }
  }
  
}

export default UserDAO;
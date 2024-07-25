import { Router } from 'express';
import passport from "passport";
import nodemailer from 'nodemailer';
import jwtAuth from '../middlewares/jwtAuth.js';
import jwt from 'jsonwebtoken';

import UserService from "../services/userService.js";
import isAdmin from "../middlewares/isAdmin.js";
import { isValidPassword, createHash } from "../utils/bcrypt.js";

const router = Router();
const userService = new UserService();

const JWT_SECRET = process.env.JWT_SECRET || "coderSecret";
const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.get('/current', jwtAuth, async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id); // Acá obtengo el id del JWT
    res.status(200).send({ status: 'success', message: 'User found', user });
  } catch (error) {
    next(error);
  }
})

router.get('/users', jwtAuth, isAdmin, async (req, res, next) => {
  try {
    const users = await userService.getUsers();
    res.status(200).send({ status: 'success', message: 'usuarios encontrados', users });
  } catch (error) {
    next(error);
  }
})

router.post('/register', async (req, res, next) => {
  try {
    const { firstName, lastName, email, age, password } = req.body;

    if (!firstName || !lastName || !email || !age || !password) {
      return res.status(400).send({ status: "error", message: "Todos los campos son requeridos" });
    }

    const existingUser = await userService.findUserEmail(email);
    if (existingUser) {
      return res.status(400).send({ status: "error", message: "El usuario ya existe" });
    }

    const newUser = {
      firstName,
      lastName,
      email,
      age,
      password: createHash(password),
    };

    const registeredUser = await userService.registerUser(newUser);
    res.status(201).send({ status: "success", message: "Usuario registrado", user: registeredUser });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ status: "error", message: "Todos los campos son requeridos" });
    }

    const user = await userService.findUserEmail(email);
    if (!user || !isValidPassword(user, password)) {
      return res.status(400).send({ status: "error", message: "Credenciales inválidas" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "coderSecret", { expiresIn: '1h' });
    res.cookie("auth", token, { maxAge: 60 * 60 * 1000 }).send({ status: "success", token });
  } catch (error) {
    next(error);
  }
});

router.get("/failRegister", (req, res) => {
  res.status(400).send({ status: "error", message: "Falla en el Registro" });
});

router.get("/failLogin", (req, res) => {
  res.redirect("/views/sessions/login");
});

router.get("/github", passport.authenticate('github', { scope: ['user:email'] }), (req, res) => {
  res.send({ status: 'success', message: 'Acceso exitoso' });
});

router.get("/githubcallback", passport.authenticate('github', { failureRedirect: '/views/sessions/login' }), async (req, res) => {
  try {
    const user = req.user;
    req.session.user = user;
    res.redirect('/views/carts');
  } catch (error) {
    console.error("Error al registrar usuario desde GitHub:", error);
    res.redirect('/views/sessions/login');
  }
});

router.get("/logout", async (req, res) => {
  res.clearCookie("auth");
  res.redirect("/login");
});

router.post('/', (req, res) => {
  const { first_name, last_name, age, email } = req.body;

  if (!first_name || !last_name || !email) {
    CustomError.createError({
      name: 'User creation error',
      cause: generateUserErrorInfo({ first_name, last_name, age, email }),
      message: 'Error trying to create User',
      code: ErrorCodes.INVALID_TYPES_ERROR
    });
  }

  let id = 1;
  if (users.length > 0) {
    id = users[users.length - 1].id + 1;
  }

  const newUser = { id, first_name, last_name, age, email };
  users.push(newUser);

  res.send({ status: 'success', payload: newUser });
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  const user = await userService.findUserEmail(email);
  if (!user) {
      return res.status(400).send({ status: "error", message: "Usuario no encontrado" });
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
  const resetLink = `http://localhost:8080/api/users/reset-password?token=${token}`;

  await transport.sendMail({
      from: 'Lucas Gatto <lucas.gatto@recargapay.com>',
      to: email,
      subject: 'Restablecimiento de Contraseña',
      html: `<div>
                <h1>Restablecimiento de Contraseña</h1>
                <p>Para restablecer su contraseña, haga clic en el siguiente enlace:</p>
                <a href="${resetLink}">Restablecer Contraseña</a>
             </div>`
  });

  res.send({ status: 'success', message: 'Correo de restablecimiento enviado' });
});

router.get('/reset-password', async (req, res) => {
  const { token } = req.query;

  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      res.render('reset-password', { token });
  } catch (error) {
      res.status(400).send({ status: 'error', message: 'Token inválido o expirado' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await userService.getUserById(decoded.id);

      if (isValidPassword(user, newPassword)) {
          return res.status(400).send({ status: 'error', message: 'La nueva contraseña no puede ser la misma que la anterior' });
      }

      const hashedPassword = createHash(newPassword);
      await userService.updateUserPassword(decoded.id, hashedPassword);

      res.send({ status: 'success', message: 'Contraseña restablecida con éxito' });
  } catch (error) {
      res.status(400).send({ status: 'error', message: 'Token inválido o expirado' });
  }
});

router.get('/premium/:uid', jwtAuth, async (req, res) => {
  const user = await userService.getUserById(req.params.uid);
  const roles = ['usuario', 'premium'];
  
  if (user.role === 'premium' || user.role === 'usuario') {
      res.render('switchRole', { title: 'Role Switcher', user: user, role: roles });
  }else{
      res.status(401).json({ error: 'Unauthorized', message: 'No tienes permiso de acceso' });
  }
});

router.put('/premium/:uid', jwtAuth, async (req, res) => {
  const uid = req.params.uid;
  const newRole = req.body.role;

  try {
    await userService.updateUserRole(uid, newRole);
    res.status(200).send("Rol actualizado exitosamente.");
  } catch (error) {
    res.status(500).send("Error actualizando el rol");
  }
});

export default router;
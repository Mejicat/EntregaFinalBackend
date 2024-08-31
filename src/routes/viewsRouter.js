import {Router} from 'express'
import passport from 'passport'

import logged from "../middlewares/logged.js";
import CartService from "../services/cartService.js";
import authRedirect from "../middlewares/authRedirect.js";

const router = Router()

//Rutas públicas
router.get('/login', logged, async (req, res) => {
  if (req.session.user) {
    return res.redirect('/views/carts') // redirige si ya hay una sesión activa
  }
  res.render(
    "login",
    {
      loginFailed: req.session.failLogin ?? false
    }
  )
})
  
router.get('/register', logged, async (req, res) => {
  if (req.session.user) {
    return res.redirect('/views/carts') // redirige si ya hay una sesión activa
  }
  res.render(
    'register', 
    {
      registerFailed: req.session.failRegister ?? false
    })
})

//Ruta si el usuario está loggeado
router.get('/user', passport.authenticate("jwt", { session: false }), (req, res, next) => {
  if (!req.user) {
      console.error('No user found in req');
  } else {
      console.log('User found in req:', req.user);
  }
  next();
}, authRedirect, async (req, res) => {
  const userId = req.user.id;
  const cart = await CartService.getCart(userId);
  res.render("user", {
      layout: "main",
      user: req.session.user,
      cart: cart
  });
});


//Endpoint de prueba del logger
if (process.env.NODE_ENV === 'development') {
  router.get("/loggerTest", (req, res) => {
    req.logger.fatal("Logger test fatal message: This is a fatal error")
    req.logger.error("Logger test error message: This is an error")
    req.logger.warning("Logger test warning message: This is a warning")
    req.logger.info("Logger test info message: This is an informational message")
    req.logger.http("Logger test http message: This is an HTTP log")
    req.logger.debug("Logger test debug message: This is a debug message")

    res.send("Logger test completed!")
  })
}

export default router;
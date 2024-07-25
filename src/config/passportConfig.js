import passport from "passport";
import jwt, { ExtractJwt } from "passport-jwt";
import GitHubStrategy from 'passport-github2';
import dotenv from 'dotenv';

import userModel from "../dao/models/userModel.js";
import UserService from "../services/userService.js";

dotenv.config();

const userService = new UserService();

const JWTStrategy = jwt.Strategy;

const initializePassport = () => {
  const GHCLIENT_ID = process.env.GHCLIENT_ID;
  const GHCLIENT_SECRET = process.env.GHCLIENT_SECRET;
  const JWT_SECRET = process.env.JWT_SECRET || "coderSecret";

  const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies.auth ?? null;
    }
    return token;
  };

  passport.use(
    'jwt',
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          const user = await userService.getUserById(jwt_payload.id);
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    'github',
    new GitHubStrategy({
      clientID: GHCLIENT_ID,
      clientSecret: GHCLIENT_SECRET,
      callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
    },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await userModel.findOne({ email: profile._json.email });
          if (!user) {
            const newUser = {
              firstName: profile._json.name ? profile._json.name.split(' ')[0] : '',
              lastName: profile._json.name ? profile._json.name.split(' ').slice(1).join(' ') : '',
              email: profile._json.email,
              age: 18, // Propongo 18 de default, para no tener problema con la restricción colocada en Users
              password: '' // GitHub no proporciona contraseñas
            };
            const registeredUser = await userService.registerUser(newUser);
            done(null, registeredUser);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user._id));

  passport.deserializeUser(async (id, done) => {
    const user = await userService.getUserById(id);
    done(null, user);
  });
};

export default initializePassport;
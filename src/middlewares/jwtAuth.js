import jwt from 'jsonwebtoken';

const jwtAuth = (req, res, next) => {
  const token = req.cookies.auth;
  if (!token) {
    return res.redirect('/views/sessions/login');
  }

  jwt.verify(token, process.env.JWT_SECRET || "coderSecret", (err, decoded) => {
    if (err) {
      return res.redirect('/views/sessions/login');
    }
    req.user = { id: decoded.id, role: decoded.role };
    next();
  });
};

export default jwtAuth;


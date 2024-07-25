const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/views/sessions/login');
  }

  if (req.user.role !== 'admin') {
    return res.status(400).send({
      status: "error",
      message: "Su usuario no se encuentra autorizado"
    });
  }

  next();
};

export default isAdmin;


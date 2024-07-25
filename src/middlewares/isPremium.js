const isPremium = (req, res, next) => {
    if (!req.user) {
      return res.redirect('/views/sessions/login');
    }
  
    if (req.user.role !== 'premium') {
      return res.status(403).send({
        status: "error",
        message: "Su usuario no se encuentra autorizado"
      });
    }
  
    return next();
  };
  
  export default isPremium;
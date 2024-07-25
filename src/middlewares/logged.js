const logged = (req, res, next) => {
  if (req.user) {
    return res.redirect('/user');
  }
  return next();
};

export default logged;
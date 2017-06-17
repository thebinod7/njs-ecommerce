
const auth = (req, res, next) => {
  if(!req.session.loggedIn) {
    res.redirect('/users/login');
  }
  next();
};

const loggedIn = (req, res, next) => {
  if(req.session.loggedIn) {
    res.redirect('/users/dashboard');
  }
  next();
};

module.exports = { auth, loggedIn };

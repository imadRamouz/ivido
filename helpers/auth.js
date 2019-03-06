module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) return next();

    req.flash('errorMsg', 'not Authorized');
    res.redirect('/users/login');
  }
}

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { id: req.user._id, email: req.user.email, cost: req.user.cost });
};
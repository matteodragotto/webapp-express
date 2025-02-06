const setimagePath = (req, res, next) => {
  req.imagePath = `${req.protocol}://${req.get('host')}/img/movies`

  next()
}

module.exports = setimagePath
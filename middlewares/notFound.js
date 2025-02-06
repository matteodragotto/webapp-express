const notFound = (req, res, next) => {
  res.status(404);
  res.json({
    message: 'Post non trovato',
    status: 404,
    error: 'Not found'
  })

}

module.exports = notFound
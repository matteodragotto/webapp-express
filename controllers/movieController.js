const connection = require('../data/db')
const setimagePath = require('../middlewares/imagePath')




const index = (req, res) => {

  const sql = 'SELECT * FROM movies'

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Richiesta al database fallita' })

    const newResults = results.map(result => (
      { ...result, image: `${req.imagePath}/${result.image}` }
    ))

    res.json(newResults)
  })
}

const show = (req, res) => {
  const id = req.params.id
  const sql = 'SELECT * FROM movies WHERE id = ?'

  const sqlMovies = `
  SELECT * 
  FROM reviews
  WHERE reviews.id = ?
  `

  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Richiesta al database fallita' })

    if (results.length === 0) return res.status(404).json({ error: 'Film non trovato' })

    let movie = results[0]

    connection.query(sqlMovies, [id], (err, movieResults) => {
      if (err) return res.status(500).json({ error: 'Richiesta al database fallita' })

      const fullImagePath = `${req.imagePath}/${movie.image}`
      res.json({ ...movie, image: fullImagePath, reviews: movieResults })

    })
  })
}

const store = (req, res) => {
  res.send('Aggiungo un film')
}

const update = (req, res) => {
  const id = req.params.id
  res.send(`Modifico il film con id ${id}`)
}

const modify = (req, res) => {
  const id = req.params.id
  res.send(`Modifico il film con id ${id}`)
}

const destroy = (req, res) => {
  const id = req.params.id
  const sql = 'DELETE FROM movies WHERE movies.id = ?'

  connection.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: 'Non è stato possibile eliminare il film' })
    res.sendStatus(204)
  })
}


module.exports = {
  index,
  show,
  store,
  update,
  modify,
  destroy
}
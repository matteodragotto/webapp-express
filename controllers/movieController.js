const connection = require('../data/db')
const setimagePath = require('../middlewares/imagePath')




const index = (req, res) => {

  const sql = `SELECT movies.*, ROUND(AVG(reviews.vote)) AS media_voti 
   FROM movies
   JOIN reviews on reviews.movie_id = movies.id
   GROUP BY movies.id;
   `

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
  WHERE reviews.movie_id = ?
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

const storeReviews = (req, res) => {
  const id = req.params.id

  const { name, text, vote } = req.body;

  if (!name || !text || !vote) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = 'INSERT INTO reviews (movie_id, name, text, vote) VALUES (?, ?, ?, ?)'

  connection.query(sql, [id, name, text, vote], (err, results) => {
    if (err) return res.status(500).json({ error: 'Richiesta al database fallita' })

    res.json({
      message: 'Review successfully added'
    });
  })

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
  storeReviews,
  update,
  modify,
  destroy
}
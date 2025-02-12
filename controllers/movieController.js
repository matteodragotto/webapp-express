const connection = require('../data/db')
const setimagePath = require('../middlewares/imagePath')
const path = require('path')
const fs = require('fs')

const index = (req, res) => {

  const sql = `SELECT movies.*, ROUND(AVG(reviews.vote)) AS media_voti 
   FROM movies
   LEFT JOIN reviews on reviews.movie_id = movies.id
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


const store = (req, res) => {
  const { title, director, genre, release_year, abstract } = req.body
  const imageName = req.file.filename;

  const sql = 'INSERT INTO movies (title, director, genre, release_year, abstract, image) VALUES (?, ?, ? , ?, ?, ?)'

  connection.query(sql, [title, director, genre, release_year, abstract, imageName], (err, results) => {

    if (err) return res.status(500).json({ error: 'Richiesta al database fallita' })

    res.json({
      message: 'Film aggiunto con successo'
    });
  })

}

const storeReviews = (req, res) => {
  const id = req.params.id

  const { name, text, vote } = req.body;

  if (!name || !text || !vote) {
    return res.status(400).json({ error: 'Tutti i campi sono necessari' });
  }

  const sql = 'INSERT INTO reviews (movie_id, name, text, vote) VALUES (?, ?, ?, ?)'

  connection.query(sql, [id, name, text, vote], (err, results) => {
    if (err) return res.status(500).json({ error: 'Richiesta al database fallita' })

    res.json({
      message: 'Recensione aggiunta con successo'
    });
  })

}

const update = (req, res) => {
  const { id } = req.params.id
  res.send(`Modifico il film con id ${id}`)
}

const modifyReviews = (req, res) => {
  const id = req.body.reviewId

  const sql = 'UPDATE reviews SET likes = likes + 1 WHERE reviews.id = ?'
  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Richiesta al database fallita' })

    res.json({
      message: 'Numero dei like della review aumentati con successo'
    });
  })
}

const destroy = (req, res) => {
  const id = req.params.id

  const selectSql = 'SELECT image FROM movies WHERE movies.id = ?'
  const sqlDelete = 'DELETE FROM movies WHERE movies.id = ?'

  connection.query(selectSql, [id], (err, results) => {
    const imageName = results[0].image
    const imagePath = path.join(__dirname, '../public/img/movies', imageName)

    fs.unlink(imagePath, (err) => {
      console.log(err);
    })

    connection.query(sqlDelete, [id], (err) => {
      if (err) return res.status(500).json({ error: 'Non è stato possibile eliminare il film' })
      res.json({ message: 'Film eliminato con successo' })
    })

  })
}


module.exports = {
  index,
  show,
  store,
  storeReviews,
  update,
  modifyReviews,
  destroy
}
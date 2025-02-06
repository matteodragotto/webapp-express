const express = require('express')
require('dotenv').config();
const app = express()
const port = process.env.PORT || 3000

const moviesRouter = require('./routes/movies')
const errorsHandler = require('./middlewares/errorsHandler')
const notFound = require('./middlewares/notFound')

app.use(express.static('public'))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Server dei film');
})

app.use('/movies', moviesRouter)

app.use(errorsHandler)
app.use(notFound)

app.listen(port, () => {
  console.log(`Sono in ascolto sulla porta ${port} `);
})
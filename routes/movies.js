const express = require('express');
const movieController = require('../controllers/movieController')
const router = express.Router();


//index
router.get('/', movieController.index);

//show
router.get('/:id', movieController.show);

//store per Reviews
router.post('/:id', movieController.storeReviews);

//update
router.put('/:id', movieController.update);

//modify per Reviews
router.patch('/reviews/:id/', movieController.modifyReviews);

//destroy
router.delete('/:id', movieController.destroy)

module.exports = router
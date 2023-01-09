const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const multer = require('../middleware/multer-config');

const sauceCrtl = require('../controllers/sauce');

router.get('/:id', auth, sauceCrtl.getOneSauces);
router.post('/', auth, multer, sauceCrtl.createSauces);
router.get('/', auth, sauceCrtl.getAllSauces);
router.put('/:id', auth, multer, sauceCrtl.modiftySauces);
router.delete('/:id', auth, sauceCrtl.deleteSauces);
router.post('/:id/like', auth, sauceCrtl.likeDislike);

module.exports = router;
const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const sauceCrtl = require('../controllers/sauce');

router.post('/', auth, sauceCrtl.createSauces);
router.put('/:id', auth, sauceCrtl.modiftySauces);
router.delete('/:id', auth, sauceCrtl.deleteSauces);
router.get('/:id', auth, sauceCrtl.getOneSauces);
router.get('/', auth, sauceCrtl.getAllSauces);

module.exports = router;
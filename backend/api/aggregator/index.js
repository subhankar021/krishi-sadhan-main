const {Router} = require('express');
const router = Router();

router.get('/', (req, res) => {
  res.end();
});

router.use('/equipments', require('./equipments'));

module.exports = router;
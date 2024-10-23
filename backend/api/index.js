const {Router} = require('express');
const router = Router();

router.get('/', (req, res) => {
  res.end();
});

router.use('/auth', require('./auth'));
router.use('/layout', require('./layout'));
router.use('/categories', require('./categories'));
router.use('/equipments', require('./equipments'));
router.use('/user', require('./user'));
router.use('/location', require('./location'));
router.use('/booking', require('./booking'));

router.use('/aggregator', require('./aggregator'));

module.exports = router;